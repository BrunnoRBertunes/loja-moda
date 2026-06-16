const darkModeToggle = document.getElementById("darkModeToggle");

if(localStorage.getItem("tema") === "dark"){
    document.body.classList.add("dark-mode");

    if(darkModeToggle){
        darkModeToggle.checked = true;
    }
}

if(darkModeToggle){
    darkModeToggle.addEventListener("change", () => {
        if(darkModeToggle.checked){
            document.body.classList.add("dark-mode");
            localStorage.setItem("tema", "dark");
        }else{
            document.body.classList.remove("dark-mode");
            localStorage.setItem("tema", "light");
        }
    });
}