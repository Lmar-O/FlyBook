var ccnEl = document.getElementById("ccn");
var ccnFeedbackEl = document.getElementById("ccn-feedback");
var ccnGroupEl = document.getElementById("ccn-group");

var cvvEl = document.getElementById("cvv");
var cvvFeedbackEl = document.getElementById("cvv-feedback");
var cvvValidationRegex = /[0-9]{3}/
var cvvGroupEl = document.getElementById("cvv-group");

var chnEl = document.getElementById("chn");
var chnFeedbackEl = document.getElementById("chn-feedback");
var chnGroupEl = document.getElementById("chn-group");

var countryEl = document.getElementById("country");
var countryFeedbackEl = document.getElementById("country-feedback");
var countryGroupEl = document.getElementById("country-group");

var stateEl = document.getElementById("state");
var stateFeedbackEl = document.getElementById("state-feedback");
var stateGroupEl = document.getElementById("state-group");

var zipCodeEl = document.getElementById("zipCode");
var zipCodeFeedbackEl = document.getElementById("zipCode-feedback");
var zipCodeGroupEl = document.getElementById("zipCode-group");

var homeAddressEl = document.getElementById("homeAddress");
var homeAddressFeedbackEl = document.getElementById("homeAddress-feedback");
var homeAddressGroupEl = document.getElementById("homeAddress-group");

ccnEl.addEventListener("change", () => validateCCN())
cvvEl.addEventListener("change", () => validateCVV())
chnEl.addEventListener("change", () => validateCHN())
countryEl.addEventListener("change", () => validateCountry())
stateEl.addEventListener("change", () => validateState())
zipCodeEl.addEventListener("change", () => validateZipCode())
homeAddressEl.addEventListener("change", () => validateHomeAddress())

function validateCCN() {
    if(ccnEl.value == null) {
        if(ccnGroupEl.classList.contains('has-success')) {
            ccnGroupEl.classList.remove('has-success')
            ccnGroupEl.classList.add('has-error')
        } else 
        if(!ccnGroupEl.classList.contains('has-error')) {
            ccnGroupEl.classList.add('has-error')
        }

        ccnFeedbackEl.textContent = 'Credit card field must be filled out';
        return false
    } else
    if(!ccnEl.value.match(/^[0-9]+$/) 
        || ccnEl.value.length != 16) 
    {
        if(ccnGroupEl.classList.contains('has-success')) {
            ccnGroupEl.classList.remove('has-success')
            ccnGroupEl.classList.add('has-error')
        } else 
        if(!ccnGroupEl.classList.contains('has-error')) {
            ccnGroupEl.classList.add('has-error')
        }

        ccnFeedbackEl.textContent = 'Credit card field must be a 16 digit number.';
        return false
    }

    if(ccnGroupEl.classList.contains('has-error')) {
        ccnGroupEl.classList.remove('has-error')
        ccnGroupEl.classList.add('has-success')
    } else 
    if(!ccnGroupEl.classList.contains('has-success')) {
        ccnGroupEl.classList.add('has-success')
    }

    ccnFeedbackEl.textContent = '';
    return true;
}

function validateCVV() {
    if(cvvEl.value == null) {
        if(cvvGroupEl.classList.contains('has-success')) {
            cvvGroupEl.classList.remove('has-success')
            cvvGroupEl.classList.add('has-error')
        } else 
        if(!cvvGroupEl.classList.contains('has-error')) {
            cvvGroupEl.classList.add('has-error')
        }

        cvvFeedbackEl.textContent = 'CVV must be filled out';
        return false
    } else
    if(!cvvEl.value.match(/[0-9]+/) 
        || cvvEl.value.length != 3) 
    {
        if(cvvGroupEl.classList.contains('has-success')) {
            cvvGroupEl.classList.remove('has-success')
            cvvGroupEl.classList.add('has-error')
        } else 
        if(!cvvGroupEl.classList.contains('has-error')) {
            cvvGroupEl.classList.add('has-error')
        }

        cvvFeedbackEl.textContent = 'CVV must be a 3 digit number.';
        return false
    }

    if(cvvGroupEl.classList.contains('has-error')) {
        cvvGroupEl.classList.remove('has-error')
        cvvGroupEl.classList.add('has-success')
    } else 
    if(!cvvGroupEl.classList.contains('has-success')) {
        cvvGroupEl.classList.add('has-success')
    }

    cvvFeedbackEl.textContent = '';
    return true;
}

function validateCHN() {
    if(chnEl.value == null) {
        if(chnGroupEl.classList.contains('has-success')) {
            chnGroupEl.classList.remove('has-success')
            chnGroupEl.classList.add('has-error')
        } else 
        if(!chnGroupEl.classList.contains('has-error')) {
            chnGroupEl.classList.add('has-error')
        }

        chnFeedbackEl.textContent = 'Card holder name must be filled out';
        return false
    } else
    if(!chnEl.value.match(/[a-zA-Z]+/)) 
    {
        if(chnGroupEl.classList.contains('has-success')) {
            chnGroupEl.classList.remove('has-success')
            chnGroupEl.classList.add('has-error')
        } else 
        if(!chnGroupEl.classList.contains('has-error')) {
            chnGroupEl.classList.add('has-error')
        }

        chnFeedbackEl.textContent = 'Card holder name must be only contain letters.';
        return false
    }

    if(chnGroupEl.classList.contains('has-error')) {
        chnGroupEl.classList.remove('has-error')
        chnGroupEl.classList.add('has-success')
    } else 
    if(!chnGroupEl.classList.contains('has-success')) {
        chnGroupEl.classList.add('has-success')
    }

    chnFeedbackEl.textContent = '';
    return true;
}

function validateCountry() {
    if(countryEl.value == null || countryEl.value == 'Country') {
        if(countryGroupEl.classList.contains('has-success')) {
            countryGroupEl.classList.remove('has-success')
            countryGroupEl.classList.add('has-error')
        } else 
        if(!countryGroupEl.classList.contains('has-error')) {
            countryGroupEl.classList.add('has-error')
        }

        countryFeedbackEl.textContent = 'Country name must be filled out';
        return false
    }

    if(countryGroupEl.classList.contains('has-error')) {
        countryGroupEl.classList.remove('has-error')
        countryGroupEl.classList.add('has-success')
    } else 
    if(!countryGroupEl.classList.contains('has-success')) {
        countryGroupEl.classList.add('has-success')
    }

    countryFeedbackEl.textContent = '';
    return true;
}

function validateState() {
    if(stateEl.value == null || stateEl.value == 'State') {
        if(stateGroupEl.classList.contains('has-success')) {
            stateGroupEl.classList.remove('has-success')
            stateGroupEl.classList.add('has-error')
        } else 
        if(!stateGroupEl.classList.contains('has-error')) {
            stateGroupEl.classList.add('has-error')
        }

        stateFeedbackEl.textContent = 'State name must be filled out';
        return false
    }

    if(stateGroupEl.classList.contains('has-error')) {
        stateGroupEl.classList.remove('has-error')
        stateGroupEl.classList.add('has-success')
    } else 
    if(!stateGroupEl.classList.contains('has-success')) {
        stateGroupEl.classList.add('has-success')
    }

    stateFeedbackEl.textContent = '';
    return true;
}

function validateZipCode() {
    if(zipCodeEl.value == null) {
        if(zipCodeGroupEl.classList.contains('has-success')) {
            zipCodeGroupEl.classList.remove('has-success')
            zipCodeGroupEl.classList.add('has-error')
        } else 
        if(!zipCodeGroupEl.classList.contains('has-error')) {
            zipCodeGroupEl.classList.add('has-error')
        }

        zipCodeFeedbackEl.textContent = 'Zip code must be filled out';
        return false
    } else
    if(zipCodeEl.value.length != 5) {
        if(zipCodeGroupEl.classList.contains('has-success')) {
            zipCodeGroupEl.classList.remove('has-success')
            zipCodeGroupEl.classList.add('has-error')
        } else 
        if(!zipCodeGroupEl.classList.contains('has-error')) {
            zipCodeGroupEl.classList.add('has-error')
        }

        zipCodeFeedbackEl.textContent = 'Zip code must be a 5 digit number';
        return false
    }

    if(zipCodeGroupEl.classList.contains('has-error')) {
        zipCodeGroupEl.classList.remove('has-error')
        zipCodeGroupEl.classList.add('has-success')
    } else 
    if(!zipCodeGroupEl.classList.contains('has-success')) {
        zipCodeGroupEl.classList.add('has-success')
    }

    zipCodeFeedbackEl.textContent = '';
    return true;
}

function validateHomeAddress() {
    if(homeAddressEl.value == null || homeAddressEl.value.length == 0) {
        if(homeAddressGroupEl.classList.contains('has-success')) {
            homeAddressGroupEl.classList.remove('has-success')
            homeAddressGroupEl.classList.add('has-error')
        } else 
        if(!homeAddressGroupEl.classList.contains('has-error')) {
            homeAddressGroupEl.classList.add('has-error')
        }

        homeAddressFeedbackEl.textContent = 'Home address must be filled out';
        return false;
    } 

    if(homeAddressGroupEl.classList.contains('has-error')) {
        homeAddressGroupEl.classList.remove('has-error')
        homeAddressGroupEl.classList.add('has-success')
    } else 
    if(!homeAddressGroupEl.classList.contains('has-success')) {
        homeAddressGroupEl.classList.add('has-success')
    }

    homeAddressFeedbackEl.textContent = '';
    return true;
}

function validateFormData() {

    // avoid short circuit optimization for boolean comparison
    // looks bad... but it must be done...
    const val1 = validateCCN() 
    const val2 = validateCVV()
    const val3 = validateCHN()
    const val4 = validateCountry()
    const val5 = validateState()
    const val6 = validateZipCode()
    const val7 = validateHomeAddress()
    
    return val1
        && val2
        && val3
        && val4
        && val5
        && val6
        && val7
}
