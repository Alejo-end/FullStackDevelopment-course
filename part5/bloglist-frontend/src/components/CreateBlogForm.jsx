const CreateBlogForm = ({ submitFunc, inputTitleValue, inputTitleChangeFunc, inputAuthorValue, inputAuthorChangeFunc, inputUrlValue, inputUrlChangeFunc }) => {
    return (
        <form onSubmit={submitFunc}>
            <div>
                title: <input value={inputTitleValue} onChange={inputTitleChangeFunc} />
                <br></br>
                author: <input value={inputAuthorValue} onChange={inputAuthorChangeFunc} />
                <br></br>
                url: <input value={inputUrlValue} onChange={inputUrlChangeFunc} />
            </div>
            <div>
                <button type="submit">create</button>
            </div>
        </form>
    )
}

export default CreateBlogForm