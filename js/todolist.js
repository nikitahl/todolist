(function(){

function SelectElements() {
  this.buttonsArray = [];
  this.barsArray = [];
  this.searchBtn = document.getElementById('search');
  this.searchBar = document.querySelector('.search-bar');
  this.addTaskBtn = document.getElementById('add-task');
  this.addTaskBar = document.querySelector('.add-task-bar');
  this.topBarInput = document.querySelectorAll('.top-bar-input');
  this.topBarInputArr = Array.prototype.slice.call(this.topBarInput);
  this.mainSection = document.querySelector('.main-section');
  this.categoryIndicator = document.querySelector('.category-indicator');
  this.categoryLabel = document.querySelectorAll('.select-category-btn');
  this.categorySelector = document.querySelectorAll('.category-checker');
  this.isActiveBar = false; // to check if there're active windows
  this.storeActiveBar = null; // will store active bar element
  // push all buttons to buttonsArray
  this.buttonsArray.push(this.searchBtn);
  this.buttonsArray.push(this.addTaskBtn);
  //push all bars to barsArray
  this.barsArray.push(this.searchBar);
  this.barsArray.push(this.addTaskBar);
}

function BarProperties( currentBar, barInput, taskDetails ) {
  this.currentBar = currentBar;
  this.barInput = barInput;
  // this.barState = null; // will be true or false to track current bar state
  this.taskPropertyDetails = taskDetails;
}

var toggler = new SelectElements();

toggler.openBar = function(details) {
  // 'this' will return SelectElements object
  var _this = toggler
      openedBar = this.storeActiveBar,
      taskDetails = details;

  function openPropertyBar() {
    addTask.taskProperties(taskDetails);
    openedBar.classList.remove('is-hidden-property-bar');
    _this.mainSection.classList.add('is-lightbox-active');
  }

  if ( openedBar.classList.contains('task-details') ) {
    setTimeout( openPropertyBar, 100 );
  } else {
    openedBar.classList.remove('is-hidden-bar');
    this.mainSection.classList.add('is-lightbox-active');
  }

  this.isActiveBar = !this.isActiveBar; // will toggle true/false

  // rotate add icon to look like close icon
  if ( openedBar === this.addTaskBar ) {
    var closeButton = document.querySelector('.add-task-btn');
    closeButton.classList.add('close-task-button');
    _this.highlightCategory();
  }

}

toggler.closeActiveBar = function() {
  var _this = toggler,
      openedBar = this.storeActiveBar,
      calendar = addTask.taskCalendar,
      calendarBtn = addTask.setDueDate;

  if ( openedBar.classList.contains('task-details') ) {
    if ( !calendar.classList.contains('is-hidden') ) {
      calendar.classList.add('is-hidden');
      calendarBtn.classList.remove('is-active-task-detail', 'selected-arrow-details');
    }
    openedBar.classList.add('is-hidden-property-bar');
  } else {
    openedBar.classList.add('is-hidden-bar');
  }

  this.isActiveBar = !this.isActiveBar; // will toggle true/false

  this.mainSection.classList.remove('is-lightbox-active');

  // rotate close icon to look add close icon
  if ( openedBar === this.addTaskBar ) {
    var closeButton = document.querySelector('.add-task-btn');
    closeButton.classList.remove('close-task-button');
    addTask.resetForm();
    _this.resetIndicator(_this.categoryIndicator);
  }

}

// Toggle between active bars
toggler.toggleBars = function(e) {
  e.preventDefault();
  // 'this' will return according BarProperties object
  var _this = toggler,
      propertyBar = this.currentBar.classList.contains('task-details');

  if ( !_this.isActiveBar ) { // check for any active bars
    _this.storeActiveBar = this.currentBar;
    _this.openBar(this);
    if ( !propertyBar ) this.barInput.focus();
  } else {
    if ( this.currentBar === _this.storeActiveBar ) { // check for is self is active
      _this.closeActiveBar();
    } else {
      _this.closeActiveBar();
      _this.storeActiveBar = this.currentBar; // change self element
      if ( !propertyBar ) this.barInput.focus();
      _this.openBar(this);
    }
  }
}

toggler.resetIndicator = function(indicatorEl) {
  var activeClass = indicatorEl.classList.item(1);
  indicatorEl.classList.remove(activeClass);
}

// Will highlight category indicator in Add Task bar
toggler.highlightCategory = function() {
  var _this = this,
      indicator = this.categoryIndicator,
      categoryBtnArray = this.categoryLabel,
      categoryChecker = this.categorySelector;

  for (var i = 0; i < categoryChecker.length; i++) {
    if ( categoryChecker[i].checked ) {
      changeCategory.call(categoryBtnArray[i]);
    }
    categoryChecker[i].addEventListener( 'change', changeCategory.bind(categoryBtnArray[i]) );
  }

  function changeCategory() {

    var getForValue = this.getAttribute("for");

    function changeColor(color) {
      _this.resetIndicator(indicator);
      indicator.classList.add(color);
    }

    switch (getForValue) {
      case "home-category":
        changeColor("category-home-bg");
        break;
      case "work-category":
        changeColor("category-work-bg");
        break;
      case "study-category":
        changeColor("category-study-bg");
        break;
      case "family-category":
        changeColor("category-family-bg");
        break;
    }
  }
}

// Close all bars when ckicking on lightbox
toggler.clearScreen = function() {
  var _this = this,
      mainSection = this.mainSection;

  function closeAllBars() {

    var hasActiveClass = mainSection.classList.contains('is-lightbox-active');

    if ( _this.isActiveBar && hasActiveClass ) {
      _this.closeActiveBar();
    }
  }
  mainSection.addEventListener('click', closeAllBars);

}

// Assign every bar opening button element an event handler
toggler.addClickEvent = function() {
  var buttonElements = this.buttonsArray,
      barsElements = this.barsArray,
      inputElements = this.topBarInputArr;

  for ( var i = 0; i < buttonElements.length; i++ ) {
    // overwrite array element with an object
    barsElements[i] = new BarProperties( barsElements[i], inputElements[i] );
    // assign event to a button with according bar as an argument
    buttonElements[i].addEventListener('click', this.toggleBars.bind( barsElements[i]) );
  }
}

toggler.init = function() {
  this.addClickEvent();
  this.clearScreen();
}

function Search() {
  this.searchBar = document.querySelector('.search-bar-input');
  this.searchForm = document.querySelector('.search-wrap');
  this.searchBtn = document.querySelector('.search-btn');
}

var search = new Search();

search.searchTasks = function(e) {

  var _this = search,
      searchBar = _this.searchBar
      searchForm = _this.searchForm,
      tasks = addTask.allTasks;

  searchBarValue = searchBar.value;

  for ( var i in tasks ) {
    var content = tasks[i].taskContent,
        result = content.search(searchBarValue);
    if ( result < 0 ) {
      tasks[i].taskBody.classList.add('is-hidden');
    } else {
      tasks[i].taskBody.classList.remove('is-hidden');
    }
  }

  toggler.closeActiveBar();
  searchForm.reset();
}

search.addEvent = function() {

  var searchForm = this.searchForm,
      searchBtn = this.searchBtn;

  searchBtn.addEventListener('click', this.searchTasks);
  searchForm.addEventListener('keydown', searchTasksEnter);

  function searchTasksEnter(event) {
    if( event.which == 13 || event.keyCode == 13 ) {
        event.preventDefault();
        search.searchTasks();
    }
  }
}

search.init = function() {
  this.addEvent();
}

function TaskObject(taskData) {
  this.taskData = taskData;
  this.taskCategory = this.taskData[0];
  this.taskFavorited = this.taskData[1];
  this.taskIndex = this.taskData[2];
  this.taskBody = this.taskData[3];
  this.taskContent = this.taskData[4];
}

function AddNewTask() {
  this.taskBarInput = document.querySelector("#add-task-input");
  this.taskBarCheckbox = document.querySelector("#favorite");
  this.taskBarCheckboxLabel = document.querySelector(".favorite-btn");
  this.favoriteIcon = document.querySelector(".fav-star");
  this.taskForm = document.querySelector(".add-task-bar");
  this.storeFavorite = null;
  this.grid = document.querySelector(".tasks-grid");
  this.gridBody = document.querySelector('.tasks-wrapper');
  this.categorySelect = document.querySelectorAll('.select-category-icons input');
  this.allTasks = [];
  this.categoryBtn = document.querySelectorAll('.category-btn');
  this.idCounter = 1;
  this.taskDetails = document.querySelector('.task-details');
  this.setDueDate = document.querySelector('.set-due-date');
  this.taskCalendar = document.querySelector('.task-calendar');
  this.taskDetailsCategory = document.querySelector('.task-category');
  this.taskDetailsName = document.querySelector('.task-details-name');
  this.taskDetailsCategoryIcon = document.querySelector('.category-icon');
  this.taskDetailsBox = document.querySelector('.details-task-box');
  this.taskDetailsFav = document.querySelector('.favourite');
  this.taskDetailsFavIcon = document.querySelector('.details-fav-star');
  this.taskDetailsFavCheck = document.querySelector('.details-favorite');
}

var addTask = new AddNewTask();

addTask.findCategory = function() {
  var categories = this.categorySelect;

  for ( var i = 0; i < categories.length; i++ ) {
    if ( categories[i].checked ) {
      return categories[i].value;
    }
  }
}

addTask.insertPosition = function(newBlock, container, nodes) {

  var el = nodes,
      nodesToArr = Array.prototype.slice.call(el);

  if ( nodesToArr.length === 0  ) {
    container.appendChild(newBlock);
  } else {
    for ( var i = 0; i < nodesToArr.length; i++ ) {
      if ( nodesToArr[i].classList.contains('is-completed') ) {

        container.insertBefore( newBlock, container.children[i] );
      } else {
        container.appendChild(newBlock);
      }
    }
  }
}

addTask.insertTaskBody = function(taskContent, taskFavorited, taskCategory, idNum) {

  var _this = this,
      tasksContainer = this.grid,
      taskStructure = this.taskStructure(taskContent, idNum),
      taskStructureSmall = this.taskStructureSmall(taskContent, idNum),
      newTaskBlock = document.createElement('div'),
      childElems = tasksContainer.children, // get all tasks as nodelist
      taskDataArray = [], //category, favorite, index, task body, task content
      categoryClass,
      obj;

  taskDataArray.push(taskCategory);
  taskDataArray.push(taskFavorited);

  switch (taskCategory) {
    case "home":
      categoryClass = "home-category";
      break;
    case "work":
      categoryClass = "work-category";
      break;
    case "study":
      categoryClass = "study-category";
      break;
    case "family":
     categoryClass = "family-category";
      break;
    default:
      categoryClass = "home-category";
      break;
  }

  newTaskBlock.classList.add('task-box', 'task-box-solid', categoryClass);

  // select last added task by its index (last in the array)
  function addedElementIndex() {
    var lastTaskIndex = childElems.length - 1;
    return lastTaskIndex;
  }

  // Check if task is favorited or not
  if (taskFavorited) {

    newTaskBlock.innerHTML = taskStructure;
    newTaskBlock.classList.add('task-box-full');

    // Favorited task always will be added in the beginning of the list
    if ( childElems.length === 0 ) {
      tasksContainer.appendChild(newTaskBlock);
    } else {
      var firstChild = childElems[0];
      tasksContainer.insertBefore( newTaskBlock, firstChild );
    }

    // Function to sort and add regular (non favorite) tasks
  } else {
    newTaskBlock.innerHTML = taskStructureSmall;
    this.insertPosition(newTaskBlock, tasksContainer, childElems);
  }

  var lastTaskIndex = childElems.length - 1,
      taskCheckbox = newTaskBlock.querySelector('.custom-checkbox'),
      taskName = newTaskBlock.querySelector('.task-link');

  // Add event on checkox change
  taskCheckbox.addEventListener( 'change', _this.taskComplete );

  taskDataArray.push(lastTaskIndex);
  taskDataArray.push(newTaskBlock);
  taskDataArray.push(taskContent);

  // Create new object with task details and store it in tasks array
  obj = new TaskObject(taskDataArray);
  this.allTasks.push(obj);

  // Create new BarProperties object with task details element in it to use it
  // in the bar toggling method in the toggler object.
  var props = new BarProperties(this.taskDetails, null, obj);
  taskName.addEventListener('click', toggler.toggleBars.bind( props ) );

}

addTask.taskStructure = function(innerContent, idValue) {
  var structure = '<div class="checkbox-wrap"><input id="task' + idValue + '" class="custom-checkbox" type="checkbox"><label class="complete centered-content" for="task' + idValue + '"></label></div><div class="task-content"><p class="location-and-date">Tomorrow</p><span class="favourite fa fa-star"></span><p class="task-name"><a href="#" class="task-link">' + innerContent + '</a></p></div>';
  return structure;
}

addTask.taskStructureSmall = function(innerContent, idValue) {
  var structure = '<div class="checkbox-wrap"><input id="task' + idValue + '" class="custom-checkbox" type="checkbox"><label class="complete centered-content" for="task' + idValue + '"></label></div><div class="task-content task-content-small"><p class="location-and-date location-and-date-small">Tomorrow</p><p class="task-name"><a href="#" class="task-link">' + innerContent + '</a></p></div>';
  return structure;
}

addTask.taskComplete = function() {

  var checkbox = this,
      checkboxContainer = this.parentNode,
      taskBody = checkboxContainer.parentNode,
      tasksContainer = addTask.grid,
      lastEl = tasksContainer.lastChild,
      containerNodes = tasksContainer.children,
      nodesToArr = Array.prototype.slice.call(containerNodes),
      storeElements = addTask.allTasks;

  // check state of the ckeckbox
  if ( checkbox.checked ) {

    // console.log(taskBody);
    tasksContainer.insertBefore( taskBody, lastEl.nextSibling );
    taskBody.classList.add('is-completed');

  } else {

    // variable to store created element index
    var elIndex;
    // loop through existing elements array
    for ( var i = 0; i < storeElements.length; i++ ) {
      var obj = storeElements[i];
      // loop through object
      for ( var j in obj ) {
        // check if property is equal to clicked elements
        if ( obj[j] === taskBody ) {
          elIndex = obj.taskIndex;
        }
      }
    }

    // remove active class and move element back to its initial index position in the DOM
    if ( elIndex === 0 ) {
      tasksContainer.insertBefore(taskBody, tasksContainer.children[elIndex]);
    } else {

        loop:
        for ( var i = 0; i < nodesToArr.length; i++ ) {
          if ( nodesToArr[i].classList.contains('is-completed') ) {
            tasksContainer.insertBefore( taskBody,tasksContainer.children[i] );
            break loop;
          }
        }
    }
    taskBody.classList.remove('is-completed');
  }
}

addTask.formValidation = function() {
  var taskInput = this.taskBarInput.value;
  return taskInput;
}

addTask.resetForm = function() {
  var _this = this;
  function resetOnClose() {
    _this.taskForm.reset();
    _this.removeFromFavorite();
  }
  setTimeout(resetOnClose, 1000); //reset form after bar is closed
}

addTask.toggleFavorite = function() {
  var _this = this;
  this.taskBarCheckboxLabel.onclick = function() {
    //select star icon
    var starIcon = _this.favoriteIcon;
    if ( starIcon.classList.contains("fa-star-o") ) {
      _this.addToFavorite();
    } else {
      _this.removeFromFavorite();
    }
  }
}

addTask.addToFavorite = function() {
  var starIcon = this.favoriteIcon;
  starIcon.classList.remove("fa-star-o");
  starIcon.classList.add("fa-star");

}

addTask.removeFromFavorite = function() {
  var starIcon = this.favoriteIcon;
  starIcon.classList.remove("fa-star");
  starIcon.classList.add("fa-star-o");
}

// Switch between categories in the navigation bar
addTask.categorySwitcher = function() {
  var _this = this,
      categoryButtons = this.categoryBtn,
      activeButton;

  function switchCategory(e) {
    e.preventDefault();
    var linkId = this.id;

    // indicate selected category in navigation bar
    if ( activeButton === undefined ) {
      activeButton = this;
      activeButton.classList.add('is-selected-category');
    } else {
      activeButton.classList.remove('is-selected-category');
      activeButton = this;
      activeButton.classList.add('is-selected-category');
    }

    // check array with added tasks if it contains tasks with specific class
    function getTasks(clss) {
      var taskClass = clss,
          tasksArray = _this.allTasks;

      for (var i = 0; i < tasksArray.length; i++) {
        var checkClass = tasksArray[i].taskCategory;

        if( taskClass === "all") {
          tasksArray[i].taskBody.classList.remove("is-hidden");
        } else if ( taskClass === checkClass) {
          tasksArray[i].taskBody.classList.remove("is-hidden");
        } else if ( taskClass !== checkClass) {
          tasksArray[i].taskBody.classList.add("is-hidden");
        }

      }
    }

    switch (linkId) {
      case "all":
        getTasks("all");
        break;
      case "home":
        getTasks("home");
        break;
      case "work":
        getTasks("work");
        break;
      case "study":
        getTasks("study");
        break;
      case "family":
        getTasks("family");
        break;
    }
  }

  for (var i = 0; i < categoryButtons.length; i++) {
    categoryButtons[i].addEventListener( 'click', switchCategory )
  }
}

addTask.toggleCalendar = function(calendarBtn) {

  var calendar = addTask.taskCalendar;

  if ( this.classList.contains('is-active-task-detail') ) {
    this.classList.remove('is-active-task-detail', 'selected-arrow-details');
    calendar.classList.add('is-hidden');
  } else {
    this.classList.add('is-active-task-detail', 'selected-arrow-details');
    calendar.classList.remove('is-hidden');
  }

}

addTask.displayCategory = function(category, icon, bar) {

  var iconClass,
      barClass,
      iconListLenght = icon.classList.length,
      barListLenght = icon.classList.length;

  if ( category === "home") iconClass = "category-home-bg", barClass = "home-category";
  if ( category === "work") iconClass = "category-work-bg", barClass = "work-category";
  if ( category === "study") iconClass = "category-study-bg", barClass = "study-category";
  if ( category === "family") iconClass = "category-family-bg", barClass = "family-category";

  if ( iconListLenght > 2 ) {
    var currentIconCategory = icon.classList.item(2),
        currentBarCategory = bar.classList.item(2);
        icon.classList.remove(currentIconCategory);
        bar.classList.remove(currentBarCategory);
  }
  icon.classList.add(iconClass);
  bar.classList.add(barClass);

}

addTask.toggleDetailsFavorite = function() {

  var allTasks = this,
      taskDetails = this.taskPropertyDetails,
      taskBody = taskDetails.taskBody,
      taskContent = taskBody.querySelector('.task-content'),
      taskFavoriteValue = taskDetails.taskFavorited,
      _this = addTask,
      icon = _this.taskDetailsFavIcon,
      label = _this.taskDetailsFav,
      favoriteCheckbox = _this.taskDetailsFavCheck,
      taskFav = _this.taskFavorited,
      createIcon = document.createElement('span');
      createIcon.classList.add('favourite', 'fa', 'fa-star');

  // Check if task is already added to favorites
  if ( favoriteCheckbox.checked ) {
    icon.classList.remove('fa-star-o');
    icon.classList.add('fa-star');
    taskBody.classList.add('task-box-full');
    taskContent.classList.remove('task-content-small');
    taskContent.insertBefore(createIcon, taskContent.lastChild);
    taskDetails.taskFavorited = true;
  } else {
      icon.classList.remove('fa-star');
      icon.classList.add('fa-star-o');
      taskBody.classList.remove('task-box-full');
      taskContent.classList.add('task-content-small');
      taskContent.removeChild(taskContent.childNodes[1]);
      taskDetails.taskFavorited = false;
  }
}

addTask.displayDetailsFavorite = function(details) {
  var details = details,
      taskFav = details.taskFavorited,
      icon = this.taskDetailsFavIcon,
      checkbox = this.taskDetailsFavCheck;

  // Check if task is favorited. Set icon and checkbox value.
  if (taskFav) {
    if (icon.classList.contains('fa-star-o')) {
      icon.classList.remove('fa-star-o');
    }
    icon.classList.add('fa-star');
    checkbox.checked = true;
  } else {
    if (icon.classList.contains('fa-star')) {
      icon.classList.remove('fa-star');
    }
    icon.classList.add('fa-star-o')
    checkbox.checked = false;
  }

}

addTask.completeTask = function() {

  // console.log(this);
  var taskDetails = this.taskPropertyDetails,
      taskBody = taskDetails.taskBody,
      checkbox = taskBody.querySelector('.custom-checkbox'),
      checkboxId = checkbox.id,
      detailsBar = this.currentBar,
      label = detailsBar.querySelector('.complete');

  label.setAttribute('for', checkboxId);
  // console.log(this);
  // console.log(checkboxId);

}

addTask.taskProperties = function(details) {
  var _this = this,
      allTasks = details,
      taskDetails = allTasks.taskPropertyDetails,
      setDate = this.setDueDate,
      detailsName = this.taskDetailsName,
      detailsCategory = this.taskDetailsCategory,
      detailsCategoryIcon = this.taskDetailsCategoryIcon,
      detailsBody = this.taskDetailsBox,
      detailsFavorite = this.taskDetailsFavCheck,
      taskName = taskDetails.taskBody.querySelector('.task-link'),
      taskNameValue = taskName.innerHTML,
      taskCategoryValue = taskDetails.taskCategory,
      completeLabel = detailsBody.querySelector('.complete');

  // console.log(taskDetails.taskFavorited);
  // Place string values into task details inner HTML
  detailsName.innerHTML = taskNameValue;
  detailsCategory.innerHTML = taskCategoryValue;

  // Display favorite icon depending on task details
  this.displayDetailsFavorite(taskDetails);

  // Set proper category color in task details
  this.displayCategory(taskCategoryValue, detailsCategoryIcon, detailsBody);

  // Event to complete task
  completeLabel.addEventListener('click', this.completeTask.bind(allTasks));

  // Event to toggle calendar in task details
  setDate.addEventListener('click', this.toggleCalendar.bind(setDate));

  // Event to toggle favorite in the task details
  detailsFavorite.addEventListener('change', this.toggleDetailsFavorite.bind(allTasks));

}

addTask.addScroll = function() {
  var body = this.gridBody,
      bodyHeight = body.offsetHeight,
      grid = this.grid,
      gridHeight = grid.offsetHeight;

  if ( gridHeight > bodyHeight ) {
    if ( body.classList.contains('is-scrollable') ) {
      return false;
    }
    body.classList.add('is-scrollable');
  }
}

addTask.createTask = function() {
  var _this = this,
  taskForm = this.taskForm;
  taskForm.addEventListener("keydown", getInputValue); // fix 'Enter' infinite bind

  function getInputValue(event) {
    if( event.which == 13 || event.keyCode == 13 ) {
      event.preventDefault(); //prevent form submit
      if ( !_this.formValidation().trim() ) {
        toggler.closeActiveBar();
      } else {
        var inputValue = _this.formValidation(),
            category = _this.findCategory(),
            idCounter = _this.idCounter;

        if ( _this.taskBarCheckbox.checked ) {
          _this.storeFavorite = true;
        } else {
          _this.storeFavorite = false;
        }
        _this.insertTaskBody(inputValue, _this.storeFavorite, category, idCounter);

        toggler.closeActiveBar();
        _this.resetForm();

        // check if tasks elements amount is higher than the app container
        _this.addScroll();
        _this.idCounter++;
      }
    }
  }
}

addTask.init = function() {
  this.createTask();
  this.toggleFavorite();
  this.categorySwitcher();
}

// initiate object methods
toggler.init();
addTask.init();
search.init();

})();
