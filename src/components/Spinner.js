import SpinnerSvg from '../assets/img/spinner.svg';

function Spinner() {
  return (
    <div className={`d-flex flex-column align-items-center justify-content-center`}>
      <img src={SpinnerSvg} width="75px" />
    </div>
  );
}

export default Spinner;
