/* -------------------------------------------------------------------------
   Output capture

   The agent's modules print with console.log, so a command's "output" is whatever it logs while it
   runs. The old code swapped console.log globally for the duration of a command. With concurrent
   requests that mixes their output, and it also swallowed unrelated log lines from the rest of the
   server (request bodies, user objects) into the response. Here console.log is patched once and
   routes to a buffer only for calls made inside that command's own async context.
   ---------------------------------------------------------------------- */
const { AsyncLocalStorage } = require('async_hooks');
const util = require('util');

const COMMAND_TIMEOUT_MS = 60 * 1000;
const MAX_CONCURRENT = 3;
const MAX_OUTPUT_BYTES = 200 * 1024;
class CommandTimeout extends Error { }

// eslint-disable-next-line no-control-regex
const stripAnsi = (text) => text.replace(/\x1b\[[0-9;]*[A-Za-z]/g, '');

const withTimeout = (promise, ms) =>
    new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new CommandTimeout('Command timed out')), ms);
        promise.then(
            (value) => { clearTimeout(timer); resolve(value); },
            (error) => { clearTimeout(timer); reject(error); }
        );
    });

const outputStore = new AsyncLocalStorage();

if (!console.log.__agentCapture) {
    const rawLog = console.log;
    const patched = function (...args) {
        const sink = outputStore.getStore();
        if (sink) return sink.write(util.format(...args));
        return rawLog.apply(this, args);
    };
    patched.__agentCapture = true;
    console.log = patched;
}

const createSink = () => {
    const lines = [];
    let bytes = 0;
    let truncated = false;

    return {
        write(line) {
            if (truncated) return;
            bytes += Buffer.byteLength(line) + 1;
            if (bytes > MAX_OUTPUT_BYTES) {
                truncated = true;
                lines.push('... output truncated ...');
                return;
            }
            lines.push(line);
        },
        text: () => stripAnsi(lines.join('\n')),
    };
};

const captureOutput = async (commandFn) => {
    const sink = createSink();
    await outputStore.run(sink, () => withTimeout(Promise.resolve().then(commandFn), COMMAND_TIMEOUT_MS));
    return sink.text();
};

module.exports = {
    capture: captureOutput,
    store: outputStore,
    timeout: new CommandTimeout('Command timout...')
}