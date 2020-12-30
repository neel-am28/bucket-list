
let items = []
const loader = document.querySelector('#loader');
const bucketList = document.querySelector('#bucketList');
const createField = document.querySelector('#create-field');
const createForm = document.querySelector('#create-form');
const searchField = document.querySelector('#search-item');
const itemField = document.querySelector('#item-list');

axios.get('/displayItems').then((response) => {
    items = response.data;
    let ourHTML = items.map(function (item) {
        return itemTemplate(item)
    }).join('')
    if (items.length === 0) {
        document.querySelector('.noData').style.display = 'block'
    }
    document.getElementById('item-list').insertAdjacentHTML('beforeend', ourHTML);
    loader.classList.add('hide');
    bucketList.classList.remove('hide');
}).catch((err) => {
    console.log(err);
})

itemTemplate = (item) => {
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                <span class="item-text">${item.item}</span>
                <div class="button-container">
                    <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1"><i style="pointer-events:none" class="fas fa-pencil-alt"></i></button>
                    <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm"><i style="pointer-events:none" class="fas fa-trash-alt"></i></button>
                </div>
            </li>`
}

// Create feature



createForm.addEventListener('submit', e => {
    e.preventDefault()
    const userInput = createField.value
    if (userInput) {
        axios.post('/create', { item: createField.value }).then((response) => {
            createField.value = ''
            createField.focus()
            document.querySelector('.noData').style.display = 'none'
            document.getElementById('item-list').insertAdjacentHTML('beforeend', itemTemplate(response.data))
        }).catch(() => {
            console.log("Please try again later");
        })
    }
})
document.addEventListener('click', function (e) {
    // Delete Feature
    if (e.target.classList.contains('delete-me')) {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this item!",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                axios.post('/delete-item', { id: e.target.getAttribute("data-id") }).then(function () {
                    // console.log(e.target.parentElement.parentElement.parentElement.childElementCount);
                    const parent = e.target.parentElement.parentElement.parentElement.childElementCount
                    if (parent === 2) {
                        document.querySelector('.noData').style.display = 'block'
                    } else {
                        document.querySelector('.noData').style.display = 'none'
                    }
                    e.target.parentElement.parentElement.remove()
                }).catch(function (err) {
                    console.log(err);
                })
            } else {
                console.log("Please try again later");
            }
        });
    }

    // Update Feature
    if (e.target.classList.contains('edit-me')) {
        e.target.blur()
        let userInput = prompt("Enter new text", e.target.parentElement.parentElement.querySelector('.item-text').innerHTML)
        if (userInput) {
            axios.post('/update-item', { item: userInput, id: e.target.getAttribute("data-id") }).then((doc) => {
                e.target.parentElement.parentElement.querySelector('.item-text').innerHTML = doc.data.value.item
            }).catch(() => {
                console.log('try again later');
            })
        }
    }
})

// add overlay when clicked on edit button
document.querySelector('.overlay').addEventListener('click', (e) => {
    if (e.target.classList.contains('overlay')) {
        document.querySelector('.overlay').classList.remove('show');
        document.querySelector('.update-container').classList.remove('show');
    }

})

// filter search feature
const filterItems = (searchTerm) => {
    Array.from(itemField.children)
        .filter((listItem) => !listItem.textContent.includes(searchTerm))
        .forEach((listItem) => listItem.classList.add('filtered'))

    Array.from(itemField.children)
        .filter((listItem) => listItem.textContent.includes(searchTerm))
        .forEach((listItem) => listItem.classList.remove('filtered'))
}

searchField.addEventListener('keyup', e => {
    const searchTerm = e.target.value.trim();
    filterItems(searchTerm)
})