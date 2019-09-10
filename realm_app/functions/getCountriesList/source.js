exports = function(){
  const http = context.services.get("http");
  const countries =[
      {name: 'United Kingdom'},
      {name: 'United States'}
    ];

  
  
  return http.get({url: "https://restcountries.eu/rest/v2/all?fields=name"})
  .then (response => {
    try {
      let countryList = (EJSON.parse(response.body.text()));
      console.log (`countryList: ${countryList}`);
      console.log (`First country: ${countryList[0].name}`);
      
      return countryList;
    }
    catch (error) {
      console.error(`Error parsing country list: ${error.message}`);
      return countries;
    }
  },
  (error) => {
    console.error(`Failed to fetch country list ${error.message}`);
    return countries;
  });
};