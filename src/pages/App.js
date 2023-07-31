import React, { useState , useEffect } from "react";
import moment from 'moment';
import ThemeSwitcher from '../components/ThemeSwitcher.js';
import Input from '../components/Input.js';
import loadIcon from '../utils/loadIcon.js';
// import Spinner from '../components/Spinner.js';

function App() {
  const [isCallingAPI, setCallingAPI] = useState(false)
  const [data, setData] = useState(null)
  const defaultFilter = {
    country: "Singapore", //default input to Singapore
  }
  const [filter, setFilter] = useState({ ...defaultFilter })
  const [err, setErr] = useState('')
  const [historyList, setHistoryList] = useState([])
  const hisLen = 5;

  const api = {
    key: "4b8c96809c3184d3b803b1ffb1339e0f",
    base: "https://api.openweathermap.org/data/2.5/"
  }

  const handleOnChange = (e) => {
    setFilter({
        ...filter,
        [e.target.name]: e.target.value,
    })
  }

  const handleReset = (e) => {
    if (e) e.preventDefault()

    // if want to default as Singapore
    // setFilter({ ...defaultFilter })

    setFilter({
      country: ''
    })
  }

  const handleRemove = (k) => {
    historyList.splice(k, 1)
    setHistoryList([...historyList])
    localStorage.setItem('historyList',JSON.stringify(historyList))
  }  

  const handleClear = () => {
    setHistoryList([])
    localStorage.setItem('historyList',JSON.stringify([]))
  }  

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    getData(filter.country);
  }

  const getData = async (country, init) => {
    if(!country) return
    setCallingAPI(true)

    if(country){
      // change country input to new value from history
      setFilter({
          ...filter,
          ['country']: country,
      })
    }

    const url = `${api.base}weather?q=${country}&units=metric&appid=${api.key}`

    // setData({
    //   "coord": {
    //     "lon": 103.8501,
    //     "lat": 1.2897
    //   },
    //   "weather": [
    //     {
    //       "id": 803,
    //       "main": "Clouds",
    //       "description": "broken clouds",
    //       "icon": "04d"
    //     }
    //   ],
    //   "base": "stations",
    //   "main": {
    //     "temp": 312.37,
    //     "feels_like": 36.19,
    //     "temp_min": 30.95,
    //     "temp_max": 32.92,
    //     "pressure": 1008,
    //     "humidity": 62
    //   },
    //   "visibility": 10000,
    //   "wind": {
    //     "speed": 7.72,
    //     "deg": 110
    //   },
    //   "clouds": {
    //     "all": 75
    //   },
    //   "dt": 1690700877,
    //   "sys": {
    //     "type": 1,
    //     "id": 9470,
    //     "country": "SG",
    //     "sunrise": 1690671943,
    //     "sunset": 1690715772
    //   },
    //   "timezone": 28800,
    //   "id": 1880252,
    //   "name": "Singapore",
    //   "cod": 200
    // })

    fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          if(result.cod == '200'){
            setData(result);
            
            // No need show history for the default search eg. Singapore
            if(!init){
              historyList.unshift(result)
              localStorage.setItem('historyList',JSON.stringify(historyList))
            }
            setCallingAPI(false)
            return
          }
          setData(null);
          setErr(result.message || 'Error')
          setCallingAPI(false)
        },
        (error) => {
          console.log(error)
        }
      )
  }

  useEffect(() => {
    // call api onload to search default country, may uncomment if dont need
    getData(filter.country, 1);

    let h = localStorage.getItem('historyList')
    if(h){
      h = JSON.parse(h)
      setHistoryList(h)
    }
  }, [])

  return (
    <div className={`main`}>
      <div className={`body`}>
        {/* Search Form */}
        <form onSubmit={handleSubmit}>
          <div className={`d-flex flex-wrap`}>
            <div className="flex-grow-1 mb-2 me-3">
              <Input 
                name={"country"} 
                value={filter.country} 
                onChange={handleOnChange} 
                placeholder={"Enter Country"}
                label={'Country / State'}
              />
            </div>

            <button type="submit" className={"btn icon primary me-3 flex-shrink-0 mb-2"}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40%" height="40%" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </button>

            <button type="button" className={"btn icon primary flex-shrink-0 mb-2"} onClick={handleReset}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40%" height="40%" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
              </svg>
            </button>
          </div>
        </form>

        <div className={`card`}>
          <div className="themeSwitcherBlock">
            <ThemeSwitcher />
          </div>


          {/* Search Result */}
          {
            // !isCallingAPI? //use this if api load is slow
              (data ? 
                <>
                  {data.weather && data.weather[0]?.icon &&
                    (
                    <img src={loadIcon(data.weather[0].icon)} className={`tempImg`}/>
                    )
                  }
                  <div className={`content`}>
                    <div>Today's Weather</div>
                    <div className={'tempNum'}>{data.main && data.main.temp}°C</div>
                    <div>
                      <span>H: {data.main && data.main.temp_max}°C</span>&nbsp;
                      <span>L: {data.main && data.main.temp_min}°C</span>
                    </div>
                    <div className={'mt-2 d-block d-md-flex flex-wrap justify-content-between align-items-center color-secondary'}>
                      <div className={'bold-7'}>
                        {data.name}, {data.sys && data.sys.country}
                      </div>
                      <div>
                        {data.dt ? moment(data.dt*1000).format('DD-MM-YYYY hh:mm A') : "-"}
                      </div>
                      <div>
                        Humidity: {data.main && data.main.humidity}%
                      </div>
                      <div>
                        {data.weather && data.weather[0].main}
                      </div>
                    </div>
                  </div>
                </>
                :
                <>
                  {err ? (
                    <div className={"alert danger text-s"}>{err}</div>
                  ):(
                    <div className={"alert text-s"}>Search Country / State to get today's weather</div>
                  )}
                </>
              )
            // :
            // <Spinner />
          }            

          {/* Search History */}
          <div className={'card_secondary mt-4'}>
            <div className={"d-flex flex-wrap justify-content-between align-items-center"}>
              <div>Search History</div>
              {historyList && historyList.length ? 
                <>
                  <div>
                    <span className={`linkStyle text-s`} onClick={handleClear}>
                      Clear All
                    </span>
                  </div>
                </>
                : null
              }
            </div>
            {historyList && historyList.length? 
              <>
                {
                  //show latest 5 history
                  historyList.slice(0,hisLen).map((v, k) => (
                    <div key={k}>
                      <div className={`history_item`}>
                        <div className={'d-flex flex-wrap align-items-center'}>
                          <div className={'d-md-flex justify-content-between flex-grow-1'}>
                            {v.name}, {v.sys && v.sys.country}
                            <div className={'text-s me-2 datetime'}>{v.dt ? moment(v.dt*1000).format('DD-MM-YYYY hh:mm A') : "-"}</div>
                          </div>
                          <div className={'d-flex align-items-center'}>
                            <button type="button" className={"btn icon s secondary"} onClick={() => getData(v.name)}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="40%" height="40%" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                              </svg>
                            </button>
                            <button type="button" className={"btn icon s secondary ms-2"} onClick={() => handleRemove(k)}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="40%" height="40%" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                }
                <div className="text-end text-s color-secondary mt-2">Showing lastest {historyList.length > 5? hisLen : historyList.length} history record(s).</div>
              </>
              :
              <>
                <div className={"text-center my-5"}>
                  <span className={"noRecordIcon"}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-clipboard-x" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M6.146 7.146a.5.5 0 0 1 .708 0L8 8.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 9l1.147 1.146a.5.5 0 0 1-.708.708L8 9.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 9 6.146 7.854a.5.5 0 0 1 0-.708z"/>
                      <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                      <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                    </svg>
                  </span>
                  <div className={"text-s text-center mt-3"}>No History Found</div>
                </div>
              </>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
