import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chat_container = document.querySelector('#chat_container');

let loadInterval;

function laoder(element){
    element.textContent = '';
    loadInterval = setInterval(() => {
        element.textContent += '.';

        if(element.textContent === '....'){
            element.textContent = '';
        }   
    },300); 
}
function typetext(element, text){
    let index = 0;
    const interval = setInterval(() => {
    if(index<text.length){
        element.innerHTML += text.charAt(index);
        index++;
    }
    else{
        clearInterval(interval);
    }
}, 20);
}
function generateuniqueid(){
    const timestamp = Date.now();
    const randomnumber = Math.random();
    const hexadecimaldstring = randomnumber.toString(16);

    return `${timestamp}-${hexadecimaldstring}`;
}
function chatstripe(isAi, value, uniqueid){
    return(
        `
        <div class = "wrapper ${isAi && 'ai'}">
            <div class = "chat">
                <div class = "profile">
                    <img src = "${isAi ? bot : user}" alt = "${isAi ? bot : 'user'}" />
                </div>
                <div class = "message" id = ${uniqueid}>${value}</div>
            </div>
        </div>
        `
    )
}
const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    chat_container.innerHTML += chatstripe(false, data.get('prompt'));

    form.reset();

    const uniqueid = generateuniqueid();    
    chat_container.innerHTML += chatstripe(true, '', uniqueid);

    chat_container.scrollTop = chat_container.scrollHeight;
    const messageDiv = document.getElementById(uniqueid);
    laoder(messageDiv);
    
    const response = await fetch('http://localhost:2000', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: data.get('prompt') })
    });
    clearInterval(loadInterval);
    messageDiv.innerHTML = '';
    if(response.ok){
        const data = await response.json();
        const parsedData = data.bot.trim();
        typetext(messageDiv, parsedData);
    }
    else{
        const err = await response.text();
        messageDiv.innerHTML = "Oops! Something went wrong."
        alert(err);
    }


}
form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
    if(e.keyCode === 13){
        handleSubmit(e);
    }
});

