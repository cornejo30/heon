const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const app = express();

app.use(cors());
app.use(express.json());

function validatePassword(password) {
    const minLength = /.{8,}/;
    const hasUppercase = /[A-Z]/;
    const hasLowercase = /[a-z]/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    const noConsecutiveNumbers = /^(?!.*(\d)\1)/;
    const noConsecutiveLetters = /^(?!.*([a-zA-Z])\1)/;

    return minLength.test(password) &&
           hasUppercase.test(password) &&
           hasLowercase.test(password) &&
           hasSpecialChar.test(password) &&
           noConsecutiveNumbers.test(password) &&
           noConsecutiveLetters.test(password);
}

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!validatePassword(password)) {
        return res.status(400).json({ message: 'La contraseña no cumple con los requisitos.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });

    try {
        await user.save();
        res.status(201).json({ message: 'Usuario registrado con éxito.' });
    } catch (err) {
        res.status(500).json({ message: 'Error al registrar usuario.' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: 'Usuario no encontrado.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Contraseña incorrecta.' });
    }

    res.status(200).json({ message: 'Inicio de sesión exitoso.' });
});

mongoose.connect('mongodb://localhost:27017/heon', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(3000, () => console.log('Servidor iniciado en http://localhost:3000')))
    .catch(err => console.error('Error al conectar a MongoDB:', err));
