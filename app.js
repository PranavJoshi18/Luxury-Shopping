function display(p, containerSelector) {
    const container = document.querySelector(containerSelector);

    p.forEach(each => {
        const prod = document.createElement("div");
        prod.classList.add("prod");

        const pImg = document.createElement("img");
        pImg.classList.add("prod-img");
        pImg.src = each.image;
        pImg.alt = each.title;

        const desc = document.createElement("div");
        desc.classList.add("desc");

        const span = document.createElement("span");
        span.innerText = each.brand;

        const h5 = document.createElement("h5");
        h5.innerText = each.title;

        const stars = document.createElement("span");
        stars.classList.add("stars");
        stars.innerText = `${each.stars} ⭐`;

        const h4 = document.createElement("h4");
        h4.innerText = `${each.price}`;

        const a = document.createElement("a");
        a.href = "cart.html";
        a.classList.add("add-to-cart")
        a.setAttribute("data-id",each.id)
        const img = document.createElement("img");
        img.src = "assets/cart.png";
        img.alt = "cart";
        img.style.width = "30px";
        img.style.height = "30px";

        a.appendChild(img);
        desc.appendChild(span);
        desc.appendChild(h5);
        desc.appendChild(stars);
        desc.appendChild(h4);
        prod.appendChild(pImg);
        prod.appendChild(desc);
        prod.appendChild(a);
        prod.setAttribute("data-id",each.id)
        container.appendChild(prod);
    });
}


fetch('products.json')
    .then(response=>response.json())
    .then(products => {
        display(products,".products .product");
    })
.catch(error => console.error("Error fetching products: ", error));

if (window.location.pathname.includes("index.html")) {
    fetch('new-arrivals.json')
        .then(response=>response.json())
        .then(products=> {
            display(products,".new-arrivals .product");
        })
    .catch(error => console.error("Error fetching products: ", error));
}

const op = document.querySelector(".options");
const hb = document.querySelector(".menu");
const c = document.querySelector(".close");
hb.addEventListener("click", () => {
    op.classList.add("show-options");
    c.classList.add("show-close")
});
c.addEventListener("click", () => {
    op.classList.remove("show-options");
    c.classList.remove("show-close");
});

setTimeout(()=>{
    document.querySelectorAll('.prod').forEach(productDiv => {
        productDiv.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            window.location.href = `product.html?id=${productId}`;
        });
    });
},100)

if (window.location.pathname.includes('product.html')) {
    function getId(id) {
        const link = new URLSearchParams(window.location.search)
        return link.get(id)
    }
    fetch('products.json')
        .then(response=>{
            return response.text()
        })
        .then(text => {
                const data = JSON.parse(text)
                const id = getId("id")
                console.log(id)
                document.querySelector(".main-img").src=data[id].image
                document.querySelector(".item-details h6").innerText = data[id].brand
                document.querySelector(".item-details h4").innerText = data[id].title
                document.querySelector(".item-details h2").innerText = data[id].price
        })
    
    const smallImg = document.querySelectorAll(".img-col img")
    smallImg.forEach(img => {
        img.addEventListener("click",()=>{
            document.querySelector(".main-img").src=img.src
        })
    })
}

setTimeout(()=>{
    document.querySelectorAll(".add-to-cart").forEach(item=>{
        item.addEventListener("click",()=>{
        const cartId = item.getAttribute("data-id")
        console.log(cartId)
        }
    )})
},100)

if (window.location.pathname.includes('cart.html')) {
    const cart=[]
    const tbody = document.querySelector("tbody")
    const tprice = document.getElementById("total")
    fetch('products.json')
        .then(response=>{
            return response.text
        })
        .then(text => {
            const data = JSON.parse(text)
            console.log(data)
            const existingProductIndex = cart.findIndex(item => item.id === cartId);
            if (existingProductIndex !== -1) {
                cart[existingProductIndex].quantity += 1;
            } else {
                cart.push({'id':cartId,'title':data[cartId].title,'img':data[cartId].image,'price':data[cartId].price,'quantity':1})
            }
            updateCart()
        })
    
    function updateCart() {
        tbody.innerHTML=''
        let total=0
        cart.forEach(item=>{
            const tr = document.createElement('tr')
    
            const first = document.createElement('td')
            const i = document.createElement('img')
            i.src = item.img
            first.appendChild(i)
            tr.appendChild(first)
    
            const second = document.createElement('td')
            second.innerText = item.title
            tr.appendChild(second)
    
            const third = document.createElement('td')
            third.innerText = item.price * item.quantity
            tr.appendChild(third)
    
            const fourth = document.createElement('td')
            fourth.innerText = item.quantity
            tr.appendChild(fourth)
    
            total += third
        })
        tprice.innerText = total.toFixed(2)
    }
}