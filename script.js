/* Fonts + Base Theme */
body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    background: var(--bg);
    color: var(--text);
    transition: 0.3s ease;
}

:root {
    --bg: #ffffff;
    --text: #000000;
    --card-bg: #f5f7ff;
    --accent: #003d99;
}

body.dark {
    --bg: #0f141a;
    --text: #e6e6e6;
    --card-bg: #1c2530;
    --accent: #4d9aff;
}

header {
    text-align: center;
    padding: 18px;
    background: var(--accent);
    color: white;
    font-size: 1.4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.controls {
    display: flex;
    gap: 12px;
    padding: 15px;
    flex-wrap: wrap;
}

input, select {
    padding: 10px;
    font-size: 1rem;
    border-radius: 8px;
    border: 1px solid #999;
    width: 250px;
}

/* Cards */
.results {
    padding: 20px;
}

.card {
    background: var(--card-bg);
    margin-bottom: 15px;
    padding: 15px;
    border-radius: 10px;
    border-left: 5px solid var(--accent);
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.card b {
    font-size: 1.2rem;
}

/* Theme Switch */
.switch {
    position: relative;
    display: inline-block;
    width: 45px;
    height: 22px;
}

.switch input {
    display: none;
}

.slider {
    position: absolute;
    cursor: pointer;
    background-color: #ccc;
    border-radius: 34px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transition: .4s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: .4s;
}

input:checked + .slider {
    background-color: var(--accent);
}

input:checked + .slider:before {
    transform: translateX(22px);
}

