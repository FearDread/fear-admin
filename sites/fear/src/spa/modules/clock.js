export default function clockModule() {
    let timer;
    const update = () => {
        const d = new Date();
        $('#clock').text([d.getHours(), d.getMinutes(), d.getSeconds()].map((n) => String(n).padStart(2, '0')).join(':'));
    };
    return { load() { update(); timer = setInterval(update, 1000); }, unload() { clearInterval(timer); } };
}
