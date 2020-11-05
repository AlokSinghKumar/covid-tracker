import { FormControl, MenuItem, Select, Card, CardContent} from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import './App.css';
import InfoBox from './Infobox';
import Map from './Map';
import Table from "./Table";
import {sortData} from "./helper/util"
import LineGraph from "./LineGraph"
import "leaflet/dist/leaflet.css";

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom ] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);


// ------------------------------------------------
// -----------FOR WORLDWIDE BY DEFAULT-------------
// ------------------------------------------------
    useEffect(() => {
        fetch ("https://disease.sh/v3/covid-19/all")
        .then(response => response.json())
        .then((data) => {
            setCountryInfo(data);
        })
    }, [])


// ------------------------------------------------
// -----------FOR DROP DOWN TO SELECT--------------
// ------------------------------------------------
  useEffect(() => {
    //The code inside here will run once
    // when the component loads and not again after

    // async -> send request, wait for it, so something with the data

    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
      });
    };

    getCountriesData();
  }, [])


  const onCountryChange = async (event) => {
    const countryCode = event.target.value

    const url = countryCode === 'worldwide' 
    ? "https://disease.sh/v3/covid-19/all"
    : `https://disease.sh/v3/covid-19/countries/${countryCode}?strict=true`
  
    await fetch(url)
    .then(response => response.json())
    .then(data => {
        setCountryInfo(data);
        setCountry(countryCode);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
    })
}

  return (
    <div className="app">
        <div className="app__left">
            <div className="app__header">
            <h1>COVID-19 TRACKER</h1>
            <FormControl>
                <Select 
                    varient="outline"
                    value={country}
                    onChange={onCountryChange}
                >
                    <MenuItem value="worldwide">worldwide</MenuItem>

                    {/* loop through all the countries and drop down list of the option */}
                    {
                    countries.map(country => (
                        <MenuItem value={country.value}>{country.name}</MenuItem>
                    ))
                    }
                </Select>
            </FormControl> 
            </div>
            
            {/* Info box for each country*/}
            <div className="app__stats">
                <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases}/>
                <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
                <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
            </div>

            {/* Map of each country */}
            <Map 
                center={mapCenter}
                zoom={mapZoom}
                countries={mapCountries}
            />
        </div>

        <Card className="app__right">
            <CardContent>
                <h3>Live Cases by Country</h3>
                <Table countries={tableData}></Table>
                <h3>worldwide new cases</h3>    
                {/* Graph */}
                <LineGraph />
            </CardContent>
        </Card>
    </div>
  );
}

export default App;
