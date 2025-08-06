
import React, { Component, useEffect } from 'react';
import axios from 'axios';

export const fetchProfileData = async (req, res) => {
        axios.get("https://api.github.com/users/FearDread")
        .then((response) => {
            console.log('res -= ', response);
            return res.send({infoclean: response.data})
        })
        .catch((err) => { console.log(err); })
};

export default fetchProfileData;