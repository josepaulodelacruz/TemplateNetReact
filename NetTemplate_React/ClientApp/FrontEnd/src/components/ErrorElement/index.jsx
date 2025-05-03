import './index.css'

const ErrorElement = ({
  children
}) => {

  return (
    <div className="error-container">
      <span className="error-text">{children}</span>
    </div>
  )

}

export default ErrorElement;
