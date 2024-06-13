document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Inicio de sesión exitoso');
            // Aquí puedes redirigir a otra página si es necesario
        } else {
            alert('Error: ' + data.message);
            document.getElementById('login-email').value = email;
            document.getElementById('login-password').value = password;
        }
    } catch (error) {
        console.error('Error en la solicitud de inicio de sesión:', error);
        alert('Error en la solicitud de inicio de sesión');
    }
});
