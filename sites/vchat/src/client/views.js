// Route templates. The router injects `html` into #app; each route's callback then
// emits `view:<name>` on the broker and the owning module binds its events.
export const views = {
    login: {
        title: 'Sign in · vchat',
        html: `
<section class="gate">
  <h1>vchat</h1>
  <p class="lede">Video rooms where only the people in the call can see the call.</p>
  <form id="login-form" class="stack" novalidate>
    <label>Email<input id="login-email" type="email" autocomplete="username" required></label>
    <label>Password<input id="login-password" type="password" autocomplete="current-password" required></label>
    <p id="login-error" class="error" role="alert" hidden></p>
    <button class="primary" type="submit">Sign in</button>
  </form>
</section>`,
    },

    lobby: {
        title: 'Rooms · vchat',
        html: `
<section>
  <header class="bar">
    <span class="brand">vchat</span>
    <button id="logout" class="quiet" type="button">Sign out</button>
  </header>
  <div class="lobby-body">
    <div>
      <h1>Start or join a room</h1>
      <p class="lede">Rooms hold up to twelve people. Share the link and they land here with the code filled in.</p>
    </div>
    <label>Your name<input id="display-name" maxlength="24" autocomplete="nickname"></label>
    <div class="split">
      <div class="panel">
        <h2>New room</h2>
        <p>Get a private link to share.</p>
        <button id="create-room" class="primary" type="button">Create room</button>
      </div>
      <div class="panel">
        <h2>Join a room</h2>
        <input id="room-code" aria-label="Room code or invite link" placeholder="Room code or invite link" autocomplete="off">
        <button id="join-room" type="button">Join room</button>
      </div>
    </div>
    <p id="lobby-error" class="error" role="alert" hidden></p>
  </div>
</section>`,
    },

    room: {
        title: 'Room · vchat',
        html: `
<section class="room">
  <header class="bar">
    <span class="brand">vchat</span>
    <span id="room-name" class="room-name"></span>
    <span id="e2ee-badge" class="badge"></span>
    <button id="copy-invite" class="quiet" type="button">Copy invite link</button>
  </header>
  <div class="room-main">
    <div class="stage">
      <div id="grid" class="grid"></div>
      <div class="controls">
        <button id="btn-mic" type="button" aria-pressed="false">Mute</button>
        <button id="btn-cam" type="button" aria-pressed="false">Camera off</button>
        <button id="btn-leave" class="danger" type="button">Leave</button>
      </div>
      <p id="room-status" class="status" role="status"></p>
    </div>
    <aside class="chat">
      <h2>Chat</h2>
      <ol id="chat-log" class="chat-log"></ol>
      <details class="safety">
        <summary>Verify encryption</summary>
        <ul id="safety-list"></ul>
        <p>Compare each code with that person out loud. If one differs, someone is between you.</p>
      </details>
      <form id="chat-form">
        <input id="chat-input" maxlength="1000" placeholder="Message the room" autocomplete="off" aria-label="Message">
        <button class="primary" type="submit">Send</button>
      </form>
    </aside>
  </div>
</section>`,
    },
};
