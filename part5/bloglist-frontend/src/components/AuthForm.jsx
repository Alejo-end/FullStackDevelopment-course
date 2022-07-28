

const AuthForm = ({ submitFunc, username, password, usernameFunc, passwordFunc, buttonDesc }) => {
    return (
        <form onSubmit={submitFunc}>
            <div>
                username: <input value={username} onChange={usernameFunc} />
            </div>
            <div>
                password: <input type="password" value={password} onChange={passwordFunc} />
            </div>
            <div>
                <button type="submit">{buttonDesc}</button>
            </div>
        </form>
    )
}

export default AuthForm;