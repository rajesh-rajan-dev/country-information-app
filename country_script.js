
$(document).ready(function(){
    //Api url for loading country
    var countryApiURl = "https://restcountries.com/v3.1/all?fields=name";

    $.ajax({
        url:countryApiURl,
        type:"GET",
        success : function(data){
            var countryDropDown = $("#countryDropdown");

            //sort
            data.sort((a,b) => a.name.common.localeCompare(b.name.common));

            $.each(data,function(index,country){
                $("<option>",{
                    value : country.name.common,
                    text : country.name.common,
                    title : country.name.common
                }).appendTo(countryDropDown);
            });
        },
        error: function(error){
            console.error("Error fetching data : ",error);
        }
    })

    function getCountryNamesByCode(borders,callback){
        if(borders === undefined){
            callback("None");
        }
        else{
            var border_countries = [];
            var promises = [];

            borders.forEach(code => {
                var promise = new Promise(function(resolve,reject){
                    $.ajax({
                        url : "https://restcountries.com/v3.1/alpha/"+code,
                        type : "GET",
                        success : function(country){
                            if(country && country[0] && country[0].name && country[0].name.common){
                                resolve(country[0].name.common);
                            } else{
                                resolve(null);
                            }
                        },
                        error:function(error){
                            console.log("Error fetching data : ",error);
                            resolve(null);
                        }
                    });
                })
                promises.push(promise);
            });

            Promise.all(promises).then(function(countryNames){
                border_countries = countryNames.filter(Boolean).join(", ")
                console.log("---------------------"+border_countries);
                callback(border_countries);
            })
        }
        
    }

    $("#countryDropdown").on("change",function(){
        var selectedCountry = $(this).val();
        var countryDetailsApiUrl = "https://restcountries.com/v3.1/name/"+selectedCountry+"?fullText=true";

        $.ajax({
                url : countryDetailsApiUrl,
                type:"GET",
                success:function(data){
                    $("#official_name").text(data[0].name.official);
                    $("#independent").text((data[0].independent)?"Yes":"No");
                    $("#un_member").text((data[0].unMember)?"Yes":"No");
                    $.each(data[0].currencies,function(code,details){
                        $("#currency").text(code + ' - '+details.name + ' ('+details.symbol+')');
                    });
                    $("#country_code").text(data[0].idd.root + data[0].idd.suffixes);
                    $("#capital").text(data[0].capital);
                    $("#region").text(data[0].region);
                    $("#sub_region").text(data[0].subregion);

                    getCountryNamesByCode(data[0].borders,function(countryNames){
                        $("#borders").text(countryNames);
                    });

                    $("#area").text(data[0].area);
                    $("#population").text(data[0].population);
                    $("#timezone").text(data[0].timezones);
                    $("#continent").text(data[0].continents);

                    var flag_img = $("<img>");
                    flag_img.attr("src",data[0].flags.png);
                    flag_img.attr("width","250px");
                    $("#flag").empty();
                    $("#flag").append(flag_img);

                    $("#flag_desc").text(data[0].flags.alt);

                    var coa_img = $("<img>");
                    coa_img.attr("src",data[0].coatOfArms.png);
                    coa_img.attr("width","250px");
                    $("#coat_of_arms").empty();
                    $("#coat_of_arms").append(coa_img);
                },
                error:function(error){
                    console.error("Error fetching data: ",error);
                }
        });
    })


})