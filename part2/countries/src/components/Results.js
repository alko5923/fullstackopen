import Country from "./Country"
import CountryDetails from "./CountryDetails"

const Results = ( { hitsToShow } ) => {
    if (hitsToShow.length === 1) {
        return (
            <div>
                <CountryDetails country={hitsToShow[0]} />
            </div>
        )
    }
    return (
    <table>
        <tbody>
        {hitsToShow.map(country => 
            <tr key={country.name.common}><Country country={country} /></tr>
        )} 
        </tbody>
    </table>
    )
}
 
export default Results