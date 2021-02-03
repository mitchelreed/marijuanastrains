
// ***********************
// app.apiKey = `7gizQS7`;
// ***********************
// creating our app object
const app = {};

// display a LIST of all FLAVORS into the <SELECT> for dropdown menu creation

app.listFlavors = (flavors) => {
    $.ajax({
        url: `https://strainapi.evanbusse.com/7gizQS7/searchdata/flavors`,
        method: 'GET',
        dataTyle: 'json'
    }).then(function (flavors) {
        // first things first, alphabetize
        flavors.sort()
        // put em all into my dropdown
        flavors.forEach(function (flavors, index) {
            // because Spicy/Herbal in the API returned no List, I cut it off from the start so it is no longer an option, also the "/" wasn't good for feng shui anyway
            if (index === 13 || index === 37) {
                $('select option[value="3"]').css("display", "none")
            } else {
                // the insertion of the rest of the flavors into the select resumes

                const flavorsIntoHtml = `
            <option value="${index}">${flavors}</option>
            `
                $('.flavors').append(flavorsIntoHtml)
            }

        })
        app.getFlavorText();
    })
}


// User selects a FLAVOR from the dropdown menu
// the flavor gets passed to the API

app.getFlavorText = () => {
    $('select#flavors').on('change', function () {
        let selectedFlavor = $('select#flavors option:selected').text();
        $('.description').empty();
        app.getStrainFlavors(selectedFlavor)
    })

}

app.getStrainFlavors = (selectedFlavor) => {
    $.ajax({
        url: `https://strainapi.evanbusse.com/7gizQS7/strains/search/flavor/${selectedFlavor}`,
        method: 'GET',
        dataTyle: 'json'
    }).then(function (flavorResults) {

        $('.displayFlavorResults').empty();
        // I also want the description to empty any time a list changes:
        // $('.description').empty();
        // send the selected flavor off to print a list of STRAINS to the page
        app.displayFlavorStrains(flavorResults);
    })
}



// Displays the STRAINS from the selected flavor option

app.displayFlavorStrains = (results) => {
    results.forEach(function (strain) {
        const resultsToAppend = `
            <div class="strains">
            <a class="${strain.id}" href="#">${strain.name}</a>
            </div>
        `
        $('.displayFlavorResults').append(resultsToAppend)

        // let the user CLICK a STRAIN from the returned flavor list
        $(`.${strain.id}`).on('click', function (e) {
            $('.description').empty();
            e.preventDefault();
            app.getDescription(`${strain.id}`);
        })
    })

}


// display the description from clicked strain

app.displayDescription = (strainDesc) => {
    // figure out how to display the description of the strain that is clicked

    // likely display beside the list, and every time a new click, 
    // clear the previous description
    // when new flavor is selected, process repeats
    if (strainDesc.desc === null) {
        const ifNull = `<p class="null">Sorry, no description for this one!</p>`
        // $('.description').empty();
        $('.description').append(ifNull)
    } else {
        const descriptionToAppend = `
        <p>${strainDesc.desc}</p>
        `
        // $('.description').empty();
        $('.description').append(descriptionToAppend)
    }



}


// gets the description of a strain from API
// strain = strainID
app.getDescription = (strain) => {
    $.ajax({
        url: `https://strainapi.evanbusse.com/7gizQS7/strains/data/desc/${strain}`,
        method: 'GET',
        dataTyle: 'json'
    }).then(function (strainDesc) {
        console.log(strainDesc);
        app.displayDescription(strainDesc);
    })
}


// initialize function
app.init = () => {
    // app.listEffects();
    app.listFlavors();
    app.getStrainFlavors(`Apple`);
    app.getDescription(29);
}


// document ready
$(function () {
    // call init method
    app.init();
});
