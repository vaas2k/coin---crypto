import './text.css';

const Text = (props) => {


    return (
        <>
            <input {...props} />
            {props.error && (
                <p className='error-message'>{props.errormessage}</p>
            )}
        </>
    )
}

export default Text;