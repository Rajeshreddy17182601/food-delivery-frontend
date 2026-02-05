let arr = [];
let isSorting = false;

const visualizer = document.getElementById("visualizer");
const sizeSlider = document.getElementById("size");
const speedSlider = document.getElementById("speed");
const newArrayBtn = document.getElementById("newArray");

function delay() {
    return new Promise(r => setTimeout(r, 110 - speedSlider.value));
}

function disableControls(state) {
    document.querySelectorAll("button,input").forEach(el => {
        if (el !== speedSlider) el.disabled = state;
    });
}

function generateArray() {
    arr = [];
    for (let i = 0; i < sizeSlider.value; i++) {
        arr.push(Math.floor(Math.random() * 380) + 20);
    }
    render();
}

function render(highlight = []) {
    visualizer.innerHTML = "";
    arr.forEach((v, i) => {
        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = v + "px";
        bar.style.width = Math.max(
            visualizer.clientWidth / arr.length,
            3
        ) + "px";
        if (highlight.includes(i)) bar.style.background = "#ff5252";
        visualizer.appendChild(bar);
    });
}

/* ===== SORTS ===== */

async function bubbleSort() {
    if (isSorting) return;
    isSorting = true;
    disableControls(true);

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            render([j, j + 1]);
            await delay();
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    finish();
}

async function selectionSort() {
    if (isSorting) return;
    isSorting = true;
    disableControls(true);

    for (let i = 0; i < arr.length; i++) {
        let min = i;
        for (let j = i + 1; j < arr.length; j++) {
            render([min, j]);
            await delay();
            if (arr[j] < arr[min]) min = j;
        }
        [arr[i], arr[min]] = [arr[min], arr[i]];
    }
    finish();
}

async function insertionSort() {
    if (isSorting) return;
    isSorting = true;
    disableControls(true);

    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;

        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            render([j, j + 1]);
            await delay();
            j--;
        }

        arr[j + 1] = key;
        render([j + 1]);
        await delay();
    }
    finish();
}

async function mergeSortStart() {
    if (isSorting) return;
    isSorting = true;
    disableControls(true);
    await mergeSort(0, arr.length - 1);
    finish();
}

async function mergeSort(l, r) {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    await mergeSort(l, m);
    await mergeSort(m + 1, r);

    let temp = [];
    let i = l, j = m + 1;

    while (i <= m && j <= r) {
        temp.push(arr[i] < arr[j] ? arr[i++] : arr[j++]);
    }
    while (i <= m) temp.push(arr[i++]);
    while (j <= r) temp.push(arr[j++]);

    for (let k = l; k <= r; k++) {
        arr[k] = temp[k - l];
        render([k]);
        await delay();
    }
}

async function quickSortStart() {
    if (isSorting) return;
    isSorting = true;
    disableControls(true);
    await quickSort(0, arr.length - 1);
    finish();
}

async function quickSort(l, r) {
    if (l >= r) return;
    let pivot = arr[r];
    let i = l;

    for (let j = l; j < r; j++) {
        render([j, r]);
        await delay();
        if (arr[j] < pivot) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            i++;
        }
    }
    [arr[i], arr[r]] = [arr[r], arr[i]];
    await quickSort(l, i - 1);
    await quickSort(i + 1, r);
}

function finish() {
    render();
    disableControls(false);
    isSorting = false;
}

newArrayBtn.onclick = generateArray;
sizeSlider.oninput = generateArray;

generateArray();
