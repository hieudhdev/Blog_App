import { useState } from "react"
import { useNavigate } from "react-router-dom";

export default function RegisterPage () {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const Navigate = useNavigate();

    async function register(ev) {
        ev.preventDefault();

        const response = await fetch('http://localhost:4000/register', {
            method: 'POST',
            body: JSON.stringify({username,password}),
            headers: {'Content-Type':'application/json'},
        });

        if (response.status === 200) {
            alert('Đăng kí thành công!');
            Navigate('/login')
        } else if (response.status === 100) {
            alert('Username đã được sử dụng!');
        } else {
            alert('Đăng kí thất bại! Hãy thử lại.');
        }
    }

    return (
        <div>
        <form className="register" onSubmit={ register }>
            <h1>Register</h1>
            <input type="text" 
                placeholder="username" 
                value={username}
                onChange={ event => setUsername(event.target.value)} />
            <input type="password" 
                placeholder="password" 
                value={password}
                onChange={ event => setPassword(event.target.value)} />
            <button>Register</button>
        </form>
        </div>
    )
}