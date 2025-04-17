var creditsDatas = [];

var creditsParent = document.getElementsByClassName("credits-parent");

async function setCreditsDatas()
{
    var pathjson = '/credits/credits.json';
    const jsonFile = await fetch(pathjson)
                        .then(function(file) {return file.json();})
                        .then(function(json) {
                            creditsDatas = json;
                        })
    
    //console.log(creditsDatas);

    for(var k = 0; k < creditsParent.length; k++)
    {
        for(var i = 0; i < creditsDatas.section.length; i++)
        {
            var sectionElement = document.createElement("p");
            sectionElement.innerHTML = "<b>" + creditsDatas.section[i].title + "</b>";
            creditsParent[k].appendChild(sectionElement);
    
            for (j = 0; j < creditsDatas.section[i].people.length; j++)
            {
                var peopleElement = document.createElement("p");
                peopleElement.innerHTML = creditsDatas.section[i].people[j].name;
                creditsParent[k].appendChild(peopleElement);
            }
    
            var separator = document.createElement("br");
            creditsParent[k].appendChild(separator);
        }
    }
}

setCreditsDatas()