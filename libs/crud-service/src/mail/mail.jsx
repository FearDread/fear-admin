
import API from "../api/instance.js";

const mailer = {

    send: (data) => async () => {
        console.log('email data = ', data);
        const email  = data.email
      
        if (!email) return res.status(400).json({ error: 'Missing email address. Please provide a correct email address.' });
    
        await axios.post("http://localhost:4000/fear/api/mail/project", data)
            .then((response) => {if (response.success) return true })
            .catch((error) => { return false });
    },

    contact: (email) => async () => {

    },
    
    subscribe: (email) => async () => {

    }

}

export default mailer;