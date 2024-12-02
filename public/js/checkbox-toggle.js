document.getElementById("newsletter-subscription").addEventListener("change", () => {
    const checkboxIcon = document.getElementById("checkbox-icon");
    
    if (document.getElementById("newsletter-subscription").checked) {
        checkboxIcon.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 4C0 1.79086 1.79086 0 4 0H20C22.2091 0 24 1.79086 24 4V20C24 22.2091 22.2091 24 20 24H4C1.79086 24 0 22.2091 0 20V4Z" class="fill-current text-[#002F34]"></path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M20.586 5L8 17.8362L3.414 13.1589H2V14.6016L7.293 20H8.7075L22 6.44217V5H20.586Z" fill="white"></path>
            </svg>
        `;
    } 
    else {
        checkboxIcon.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20,2a2,2,0,0,1,2,2V20a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V4A2,2,0,0,1,4,2H20m0-2H4A4,4,0,0,0,0,4V20a4,4,0,0,0,4,4H20a4,4,0,0,0,4-4V4a4,4,0,0,0-4-4Z" class="fill-current text-[#002F34]"></path>
            </svg>
        `;
    }
});