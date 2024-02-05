function Input({name, value, onChange, placeholder, label}) {
    return (
      <div className={"form-floating"}>
        <input 
          type="text" 
          className={'form-control'}
          name={name} 
          value={value} 
          onChange={onChange} 
          placeholder={placeholder}
          required
        ></input>
        <label className={`form-label`}>{label}</label>
    </div>
    );
}

export default Input;
