const nodos = [];
let $canvas = document.getElementById("myCanvas");
let ctx = $canvas.getContext("2d");
document.addEventListener("DOMContentLoaded",(e)=>{
    esqueletoGraf();
    document.getElementById("gen_matAdy").addEventListener("click", e=>{
        genMatrizAd();
        calfloyd();
    })
})

class Nodo {
    constructor(numNodo, posX, posY){
        this.ady = [];
        this.posX = posX;
        this.posY = posY;
        this.numNodo = numNodo;
    }
}

const esqueletoGraf = () => {
    let numNodo = 0;
    $canvas.addEventListener('click', (e)=>{
        //se genera un nodo por cada click
        numNodo++;
        // console.log($canvas.offsetLeft);
        // console.log($canvas.offsetTop);
        // console.log(e.offsetX, e.offsetY);
        // console.log(e.clientX, e.clientY);
        //se asignan los datos a cada nodo
        let coorX = e.offsetX
        let coorY = e.offsetY
        let nodo = new Nodo(numNodo, coorX, coorY);
        // se agrega el nodo a la lista
        nodos.push(nodo);
        //se grafica el grafo
        ctx.font = "20px Arial";
        ctx.fillText(numNodo, coorX+10,coorY);
        //se envia el grafo
        //console.log(nodos);
    })
}

let frag=``;

const genMatrizAd = () => {
    //console.log(numNodos);
    const $ady = document.getElementById("ady");
    $ady.style.display = "grid";
    $ady.style.gridTemplateColumns = `repeat(${nodos.length+1}, 1fr)`;
    $ady.style.gridTemplateRows = `repeat(${nodos.length+1}, 1fr)`;
    $ady.style.backgroundColor ='';
    $ady.style.height ='fit-content';

    for (let i = 0; i < nodos.length+1; i++) {
        frag += `<div id="nodoCont">${i}</div>`
    }

    nodos.forEach((nodo, iterador) => {
        nodo.ady.push(`<div id="nodoCont">${iterador+1}</div>`)
        for (let j = 0; j < nodos.length; j++) {
            nodo.ady.push(`<input type="text" value="X" class="valor">`)
        }
// ${j+iterador++}
        nodo.ady.forEach(input => {
            frag += input;
        });
    });

    // console.log(nodos);

    $ady.innerHTML=frag+`<button id="floyd" type="submit">Iniciar Floyd</button>`
};

let fils = new Array();
let matrizFinal = [];
const calfloyd = () => {
    document.getElementById("floyd").addEventListener("click", e=>{
        e.preventDefault();
        const $valores = document.querySelectorAll(".valor");
        let colsMFinal = new Array();
        let cols = new Array();
        $valores.forEach((val, iter) => {
            cols.push(val.value==="X"?1000000:parseInt(val.value));
            colsMFinal.push("V");
            //console.log((iter+1)%nodos.length===0);
            if ((iter+1)%nodos.length===0) {
                fils.push(cols);
                matrizFinal.push(colsMFinal);
                cols = new Array();
                colsMFinal = new Array();
            }
        });
        
        //console.log(fils);
        
        // muestra filas y cols
        //console.log(fils[0][3]);
        
        matRecoridos();
        dibujarGraf();
        calcularFloyd();
    });
};

const dibujarGraf = () => {
    for (let i = 0; i < fils.length; i++) {
        let posxNodoUno = nodos[i].posX;
        let posYNodoUno = nodos[i].posY;
        for (let j = 0; j < fils.length; j++) {
            let posxNodoDos = nodos[j].posX;
            let posYNodoDos = nodos[j].posY;
            //console.log(fils[i][j]);
            if (fils[i][j] !== 1000000 && fils[i][j] !== 0) {
                ctx.moveTo(posxNodoUno, posYNodoUno);
                ctx.lineTo(posxNodoDos, posYNodoDos);
                ctx.stroke();

                ctx.font = "20px Arial";
                ctx.fillStyle = "red";
                ctx.fillText(fils[i][j], (posxNodoUno+posxNodoDos)/2, 15+(posYNodoDos+posYNodoUno)/2);
            }
        }
    }
}

const calcularFloyd = () => {
    //console.log(fils);

    let $seleccionK = document.getElementById("pivote");
    let excentricidad = ``;
    const $cont = document.getElementById("contenedor");
    let ver = ``;
    let verMFinal = ``;
    for (let m = 0; m < nodos.length+1; m++) {
        ver += `<div id="nodoCont">${m}</div>`;
        verMFinal += `<div id="nodoCont">${m}</div>`;
    }
    let recorridoMFinal = ``;
    for (let k = 0; k < nodos.length; k++) {
        let recorridoK = ver;
        recorridoMFinal = verMFinal;
        for (let i = 0; i < nodos.length; i++) {
            recorridoK += `<div id="nodoCont">${i+1}</div>`;
            recorridoMFinal += `<div id="nodoCont">${i+1}</div>`;
            for (let j = 0; j < nodos.length; j++) {
                if ((fils[i][k]+fils[k][j])<fils[i][j]) {
                    fils[i][j]=fils[i][k]+fils[k][j];
                    matrizFinal[i][j]=k+1;
                }
                recorridoK += `<p>${fils[i][j]===1000000 ? "x":fils[i][j]}</p>`;
                recorridoMFinal += `<p>${matrizFinal[i][j]==="V" ? "D":matrizFinal[i][j]}</p>`;
            }
        }
        // console.log(recorridoK);
        // console.log(fils);
        // console.log(k);
        let div = `<div style="display:grid; grid-template-rows:repeat(${nodos.length}, 1fr); grid-template-columns:repeat(${nodos.length+1}, 1fr);">${recorridoK}</div>`;
        let mRecoridos = `<div class="mRecoridos">
                            <h2>Matrices pivotes K=${k+1}</h2>
                            ${div}
                        </div>`
        $cont.insertAdjacentHTML("beforeend", mRecoridos);
    }

    let divMfinal = `<div style="display:grid; grid-template-rows:repeat(${nodos.length}, 1fr); grid-template-columns:repeat(${nodos.length+1}, 1fr);">${recorridoMFinal}</div>`;
    let mRecoridosFinal = `<div class="mRecoridos">
                        <h2>Matriz de Recorridos</h2>
                        ${divMfinal}
                    </div>`
    $cont.insertAdjacentHTML("beforeend", mRecoridosFinal);

    /** calculo excentricidad */
    let max = ``;
    let arMax = [];
    for (let i = 0; i < nodos.length; i++) {
        max += `<p>Vertice ${i+1} : ${Math.max(...(fils[i]))}</p>`
        arMax.push(Math.max(...(fils[i])))
    }

    let min = arMax[0],
        pos=0;
    for (let i = 0; i < nodos.length; i++) {
        if (arMax[i]<min) {
            min = arMax[i];
            pos = i;
        }
    }

    // let min = Math.min(...arMax);
    let ex = `<div class="exc">
                        <h2>Excentricidad de vertices</h2>
                        ${max}
                        <h2>El vertice mas central es: ${pos+1} con ${min}</h2>
                    </div>`
    $cont.insertAdjacentHTML("beforeend", ex);

    // console.log(max, arMax);
}

const matRecoridos = () => {
    console.log(matrizFinal);
}