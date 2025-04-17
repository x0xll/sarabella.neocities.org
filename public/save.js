function saveToLocalStorage(key, value)
{
    localStorage.setItem(key, value);
}

function loadFromLocalStorage(key)
{
    return localStorage.getItem(key);
}