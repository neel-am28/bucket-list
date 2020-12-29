
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

    document.getElementById('item-list').innerHTML = ourHTML;
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
            document.getElementById('item-list').innerHTML = itemTemplate(response.data)
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
            text: "Once deleted, you will not be able to recover this list item!",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                axios.post('/delete-item', { id: e.target.getAttribute("data-id") }).then(function () {
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

        const updateForm = document.querySelector('#update-form');
        const updateField = document.querySelector('#update-field');
        const updateContainer = document.querySelector('.update-container');
        const overlay = document.querySelector('.overlay');
        updateContainer.classList.add('show')
        overlay.classList.add('show')
        updateField.value = e.target.parentElement.parentElement.querySelector('.item-text').innerHTML
        updateForm.addEventListener('submit', event => {
            event.preventDefault()
            if (updateField.value) {
                axios.post('/update-item', { item: updateField.value, id: e.target.getAttribute("data-id") }).then(() => {
                    e.target.parentElement.parentElement.querySelector('.item-text').innerHTML = updateField.value
                    document.querySelector('.overlay').classList.remove('show');
                    document.querySelector('.update-container').classList.remove('show');
                }).catch(() => {
                    console.log('try again later');
                })
            }

        })
    }
})

// updateForm.addEventListener('submit', event => {
//     event.preventDefault()
//     if (updateField.value) {
//         axios.post('/update-item', { item: updateField.value, id: e.target.getAttribute("data-id") }).then(() => {
//             e.target.parentElement.parentElement.querySelector('.item-text').innerHTML = updateField.value
//             document.querySelector('.overlay').classList.remove('show');
//             document.querySelector('.update-container').classList.remove('show');
//         }).catch(() => {
//             console.log('try again later');
//         })
//     }

// })

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