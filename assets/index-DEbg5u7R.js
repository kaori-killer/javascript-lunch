var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _dataList, _category, _sorting, _isWishList;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function createElement({ tag, classNames = [], ...attributes }) {
  const $element = document.createElement(tag);
  classNames.forEach((className) => $element.classList.add(className));
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === "required") {
      $element.required = Boolean(value);
    } else {
      $element.setAttribute(key, value);
    }
  });
  return $element;
}
function RestaurantHeader(text) {
  const $header = createElement({ tag: "header", classNames: ["gnb"] });
  const $title = createElement({
    tag: "h1",
    classNames: ["gnb__title", "text-title"]
  });
  const $addButton = createElement({
    tag: "button",
    type: "button",
    classNames: ["gnb__button"],
    ["aria-babel"]: "음식점 추가"
  });
  const $addButtonImg = createElement({
    tag: "img",
    src: "./add-button.png",
    alt: "음식점 추가"
  });
  $title.textContent = "점심 뭐 먹지?";
  $header.appendChild($title);
  $header.appendChild($addButton);
  $addButton.appendChild($addButtonImg);
  return $header;
}
const ERROR_MASSAGE = Object.freeze({
  category: "카테고리를 선택해 주세요",
  distance: "거리를 선택해 주세요",
  name: "식당 이름은 2글자 이상 입력해 주세요"
});
const CATEGORY_IMAGE = Object.freeze({
  한식: "./category-korean.png",
  중식: "./category-chinese.png",
  일식: "./category-japanese.png",
  양식: "./category-western.png",
  아시안: "./category-asian.png",
  기타: "./category-etc.png"
});
class RestaurantData {
  constructor({ id, name, distance, description = "", link = "", category, isWish }) {
    __publicField(this, "id");
    __publicField(this, "src");
    __publicField(this, "alt");
    __publicField(this, "name");
    __publicField(this, "distance");
    __publicField(this, "description");
    __publicField(this, "link");
    __publicField(this, "category");
    __publicField(this, "isWish");
    this.validateCategory(category);
    this.validateDistance(distance);
    this.validateName(name);
    this.id = id || crypto.randomUUID();
    this.src = CATEGORY_IMAGE[category];
    this.alt = category;
    this.name = name;
    this.distance = Number(distance);
    this.description = description;
    this.link = link;
    this.category = category;
    this.isWish = isWish;
  }
  getData() {
    return {
      id: this.id,
      src: this.src,
      alt: this.alt,
      name: this.name,
      distance: this.distance,
      description: this.description,
      link: this.link,
      category: this.category,
      isWish: this.isWish
    };
  }
  getId() {
    return this.id;
  }
  toggleIsWish() {
    this.isWish = !this.isWish;
  }
  isValidateOption(value) {
    return !value;
  }
  isValidateName(name) {
    const NAME_LENGTH_MIN = 2;
    return name.length < NAME_LENGTH_MIN;
  }
  validateCategory(category) {
    if (this.isValidateOption(category)) throw Error(ERROR_MASSAGE.category);
  }
  validateDistance(distance) {
    if (this.isValidateOption(distance)) throw Error(ERROR_MASSAGE.distance);
  }
  validateName(name) {
    if (this.isValidateName(name)) throw Error(ERROR_MASSAGE.name);
  }
}
class RestaurantDataList {
  constructor() {
    __privateAdd(this, _dataList);
    const dataList = this.getLocalStorage() || [];
    __privateSet(this, _dataList, dataList.map((data) => this.createData(data)));
  }
  getDataList() {
    return __privateGet(this, _dataList).map((restaurantData) => restaurantData.getData());
  }
  getData(id) {
    return __privateGet(this, _dataList).find((dataList) => dataList.getId() === id);
  }
  addData(data) {
    __privateGet(this, _dataList).push(this.createData(data));
    this.setLocalStorage(__privateGet(this, _dataList));
  }
  createData(data) {
    return new RestaurantData(data);
  }
  updateIsWish(id) {
    const filteredData = this.getData(id);
    if (!filteredData) return void 0;
    filteredData.toggleIsWish();
    this.setLocalStorage(__privateGet(this, _dataList));
    return filteredData.isWish;
  }
  deleteDataList(id) {
    __privateSet(this, _dataList, __privateGet(this, _dataList).filter((data) => data.getId() !== id));
    this.setLocalStorage(__privateGet(this, _dataList));
  }
  getLocalStorage() {
    const dataList = localStorage.getItem("dataList");
    return dataList ? JSON.parse(dataList) : null;
  }
  setLocalStorage(dataList) {
    localStorage.setItem("dataList", JSON.stringify(dataList.map((data) => data.getData())));
  }
}
_dataList = new WeakMap();
const dummy = [
  {
    id: "1234",
    category: "한식",
    name: "피양콩할마니",
    distance: 10,
    description: "평양 출신의 할머니가 수십 년간 운영해온 비지 전문점 피양콩 할마니. 두부를 빼지 않은 되비지를 맛볼 수 있는 곳으로, ‘피양’은 평안도 사투리로 ‘평양’을 의미한다. 딸과 함께 운영하는 이곳에선 맷돌로 직접 간 콩만을 사용하며, 일체의 조미료를 넣지 않은 건강식을 선보인다. 콩비지와 피양 만두가 이곳의 대표 메뉴지만, 할머니가 옛날 방식을 고수하며 만들어내는 비지전골 또한 이 집의 역사를 느낄 수 있는 특별한 메뉴다. 반찬은 손님들이 먹고 싶은 만큼 덜어 먹을 수 있게 준비돼 있다",
    isWish: false,
    link: "https://www.youtube.com/watch?v=66aWspy73tg"
  },
  {
    id: "2345",
    category: "양식",
    name: "파스타",
    distance: 5,
    description: "레전드 파스타 맛집",
    isWish: true,
    link: "https://www.figma.com/design/KcViH81qTQERbbJtBlTEqZ/%EB%A0%88%EB%B2%A81-%EB%AF%B8%EC%85%98-%EB%94%94%EC%9E%90%EC%9D%B8-(%ED%81%AC%EB%A3%A8-%EA%B3%B5%EC%9C%A0%EC%9A%A9)?node-id=1-2&p=f&t=rUKgIzZFY2Hr1J7T-0"
  },
  {
    id: "3456",
    category: "일식",
    name: "참치방어스시",
    distance: 7,
    description: "참치와 방어가 맛있는 참지입니다. 또 가고 싶어요",
    isWish: false,
    link: "https://ofcourse.kr/css-course/cursor-%EC%86%8D%EC%84%B1"
  }
];
localStorage.setItem("dataList", JSON.stringify(dummy));
const restaurantDataList = new RestaurantDataList();
class SelectedFilterValue {
  constructor() {
    __privateAdd(this, _category);
    __privateAdd(this, _sorting);
    __privateAdd(this, _isWishList);
    __privateSet(this, _category, "한식");
    __privateSet(this, _sorting, "이름순");
    __privateSet(this, _isWishList, false);
  }
  updateSelectedFilterValue(id, value) {
    if (id === "category-filter") {
      __privateSet(this, _category, value);
    }
    if (id === "sorting-filter") {
      __privateSet(this, _sorting, value);
    }
    if (id === "restaurant-tab") {
      __privateSet(this, _isWishList, value);
    }
  }
  getSelectedFilterCategoryValue() {
    return __privateGet(this, _category);
  }
  getSelectedFilterSortingValue() {
    return __privateGet(this, _sorting);
  }
  getIsWishList() {
    return __privateGet(this, _isWishList);
  }
}
_category = new WeakMap();
_sorting = new WeakMap();
_isWishList = new WeakMap();
const selectedFilterValue = new SelectedFilterValue();
function reRenderRestaurantListContainer(parent, element) {
  removeRestaurantListContainer();
  parent.appendChild(element);
}
function removeRestaurantListContainer() {
  document.querySelector(".restaurant-list-container").remove();
}
function RestaurantItem({
  id,
  src,
  alt,
  name,
  distance,
  description,
  isWish,
  link,
  isColumn = false
}) {
  const $restaurantItem = createElement({
    tag: "li",
    classNames: ["restaurant"],
    id
  });
  const $restaurantCategory = createElement({
    tag: "div",
    classNames: ["restaurant__category"]
  });
  const $categoryIcon = createElement({
    tag: "img",
    src,
    alt,
    classNames: ["category-icon"]
  });
  const $restaurantInfo = createElement({
    tag: "div",
    classNames: ["restaurant__info"]
  });
  const $restaurantName = createElement({
    tag: "h3",
    classNames: ["restaurant__name", "text-subtitle"]
  });
  const $restaurantDistance = createElement({
    tag: "span",
    classNames: ["restaurant__distance", "text-body"]
  });
  const $restaurantDescription = createElement({
    tag: "p",
    classNames: ["restaurant__description", "text-body"]
  });
  const $restaurantWish = createElement({
    tag: "div",
    classNames: ["restaurant-wish", "text-body"]
  });
  const $restaurantStar = createElement({
    tag: "span",
    classNames: ["restaurant-star", `${isWish && "active"}`],
    id
  });
  const $restaurantLink = createElement({
    tag: "a",
    href: link,
    target: "_blank",
    classNames: ["text-body"]
  });
  if (isColumn) {
    $restaurantItem.classList.add("modal-column");
    $restaurantDescription.classList.add("text-column");
  }
  $restaurantStar.addEventListener("click", (event2) => {
    event2.stopPropagation();
    toggleStar(event2.target);
  });
  function toggleStar(element) {
    const isWish2 = restaurantDataList.updateIsWish(id);
    if (!isWish2 && isColumn) {
      $restaurantStar.classList.toggle("active");
    }
    if (!isColumn) {
      Restaurant({ isReRender: true });
    }
  }
  $restaurantCategory.appendChild($categoryIcon);
  $restaurantInfo.appendChild($restaurantName);
  $restaurantInfo.appendChild($restaurantDistance);
  $restaurantInfo.appendChild($restaurantDescription);
  $restaurantWish.appendChild($restaurantStar);
  $restaurantItem.appendChild($restaurantCategory);
  $restaurantItem.appendChild($restaurantInfo);
  $restaurantItem.appendChild($restaurantWish);
  $restaurantName.textContent = name;
  $restaurantDistance.textContent = `캠퍼스로부터 ${distance}분 내`;
  $restaurantDescription.textContent = description;
  $restaurantStar.textContent = "★";
  if (isColumn) {
    console.log(link);
    $restaurantInfo.appendChild($restaurantLink);
    $restaurantLink.textContent = link;
  }
  return $restaurantItem;
}
function RestaurantListContainer(restaurantItems) {
  const $restaurantListContainer = createElement({
    tag: "section",
    classNames: ["restaurant-list-container"]
  });
  const $restaurantList = createElement({
    tag: "ul",
    classNames: ["restaurant-list"]
  });
  const restaurantElements = restaurantItems.map(
    (restaurantItem) => RestaurantItem({ ...restaurantItem })
  );
  $restaurantList.append(...restaurantElements);
  $restaurantListContainer.appendChild($restaurantList);
  return $restaurantListContainer;
}
function createDefaultOption() {
  const defaultContext = "선택해 주세요.";
  const $defaultOption = createElement({
    tag: "option",
    value: ""
  });
  $defaultOption.textContent = defaultContext;
  return $defaultOption;
}
function selectOption($option, option, selectedValue) {
  if (selectedValue && selectedValue === option) {
    $option.selected = true;
  }
}
function Options(options, selectedValue) {
  const $fragment = document.createDocumentFragment();
  if (!selectedValue) {
    const $defaultOption = createDefaultOption();
    $fragment.appendChild($defaultOption);
  }
  options.forEach((option) => {
    const $option = createElement({ tag: "option", value: option });
    selectOption($option, option, selectedValue);
    $option.textContent = option;
    $fragment.appendChild($option);
  });
  return $fragment;
}
function Select({
  name,
  id,
  classNames = [],
  options,
  isRequired = false,
  selectedValue = ""
}) {
  const $select = createElement({
    tag: "select",
    name,
    id,
    classNames,
    required: isRequired,
    selectedValue
  });
  const $options = Options(options, selectedValue);
  $select.addEventListener("change", function() {
    selectedFilterValue.updateSelectedFilterValue(id, this.value);
    if (id === "category-filter" || id === "sorting-filter") {
      Restaurant({ isReRender: true });
    }
  });
  $select.appendChild($options);
  return $select;
}
function RestaurantFilterContainer() {
  const $restaurantFilterContainer = createElement({
    tag: "section",
    classNames: ["restaurant-filter-container"]
  });
  $restaurantFilterContainer.append(
    Select({
      name: "category",
      id: "category-filter",
      classNames: ["restaurant-filter"],
      options: ["전체", "한식", "중식", "일식", "양식", "아시안", "기타"],
      selectedValue: selectedFilterValue.getSelectedFilterCategoryValue()
    })
  );
  $restaurantFilterContainer.append(
    Select({
      name: "sorting",
      id: "sorting-filter",
      classNames: ["restaurant-filter"],
      options: ["이름순", "거리순"],
      selectedValue: selectedFilterValue.getSelectedFilterSortingValue()
    })
  );
  return $restaurantFilterContainer;
}
function closeModal() {
  document.querySelector(".modal").remove();
  Restaurant({ isReRender: true });
}
function Button({ variant, type, text, onClick }) {
  const $button = createElement({
    tag: "button",
    classNames: ["button", `button--${variant}`, "text-caption"],
    type
  });
  $button.textContent = text;
  $button.onclick = onClick;
  return $button;
}
function RestaurantItemDetailModalButtonContainer({ restaurantId }) {
  const $div = createElement({
    tag: "div",
    classNames: ["button-container"]
  });
  $div.appendChild(
    Button({
      variant: "secondary",
      type: "button",
      text: "삭제하기",
      onClick: () => deleteItemButton(restaurantId)
    })
  );
  $div.appendChild(
    Button({
      variant: "primary",
      type: "submit",
      text: "닫기",
      onClick: closeModal
    })
  );
  return $div;
}
function deleteItemButton(restaurantId) {
  restaurantDataList.deleteDataList(restaurantId);
  closeModal();
}
function RestaurantItemDetailModal({ restaurantId, isColumn }) {
  const $fragment = document.createDocumentFragment();
  const restaurant = restaurantDataList.getData(restaurantId);
  $fragment.appendChild(RestaurantItem({ ...restaurant.getData(), isColumn }));
  $fragment.appendChild(RestaurantItemDetailModalButtonContainer({ restaurantId }));
  return $fragment;
}
function filterRestaurantDataList({ restaurantDataList: restaurantDataList2, isWishList }) {
  const filteredRestaurantDataList = filterByCategory(restaurantDataList2);
  const sortedRestaurantDataList = sortByCategory(filteredRestaurantDataList);
  const filteredByStar = isWishList ? filterByStar(sortedRestaurantDataList) : sortedRestaurantDataList;
  return filteredByStar;
}
function filterByCategory(dataList) {
  const category = selectedFilterValue.getSelectedFilterCategoryValue();
  selectedFilterValue.getSelectedFilterSortingValue();
  return dataList.filter(
    (data) => category === "전체" || data.category === category
  );
}
function sortByCategory(dataList) {
  const category = selectedFilterValue.getSelectedFilterSortingValue();
  if (category === "이름순") {
    dataList.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (category === "거리순") {
    dataList.sort((a, b) => {
      if (a.distance > b.distance) return 1;
      if (a.distance < b.distance) return -1;
      return 0;
    });
  }
  return dataList;
}
function filterByStar(dataList) {
  return dataList.filter((data) => data.isWish === true) || [];
}
function RestaurantFilterTabs() {
  const $restaurantFilterContainer = createElement({
    tag: "div",
    classNames: ["restaurant-filter-tabs"]
  });
  const $allTab = createElement({
    tag: "button",
    classNames: ["restaurant-tab", "all-tab"]
  });
  const $wishTab = createElement({
    tag: "button",
    classNames: ["restaurant-tab", "wish-tab"]
  });
  $allTab.textContent = "모든 음식점";
  $wishTab.textContent = "자주 가는 음식점";
  $restaurantFilterContainer.appendChild($allTab);
  $restaurantFilterContainer.appendChild($wishTab);
  function wishListClassToggle() {
    if (selectedFilterValue.getIsWishList()) {
      $wishTab.classList.add("active");
      $allTab.classList.remove("active");
    } else {
      $allTab.classList.add("active");
      $wishTab.classList.remove("active");
    }
  }
  wishListClassToggle();
  $allTab.addEventListener("click", () => {
    selectedFilterValue.updateSelectedFilterValue("restaurant-tab", false);
    wishListClassToggle();
    Restaurant({ isReRender: true });
  });
  $wishTab.addEventListener("click", () => {
    selectedFilterValue.updateSelectedFilterValue("restaurant-tab", true);
    wishListClassToggle();
    Restaurant({ isReRender: true });
  });
  return $restaurantFilterContainer;
}
function Modal({ component }) {
  const $body = document.querySelector("body");
  const $modal = createElement({
    tag: "div",
    classNames: ["modal", "modal--open"]
  });
  const $modalBackdrop = createElement({
    tag: "div",
    classNames: ["modal-backdrop"]
  });
  const $modalContainer = createElement({
    tag: "div",
    classNames: ["modal-container"]
  });
  $body.appendChild($modal);
  $modal.appendChild($modalBackdrop);
  $modal.appendChild($modalContainer);
  $modalContainer.appendChild(component());
}
function Restaurant({ isReRender }) {
  const filteredRestaurantDataList = filterRestaurantDataList(
    {
      restaurantDataList: [...restaurantDataList.getDataList()],
      isWishList: selectedFilterValue.getIsWishList()
    }
  );
  const $body = document.querySelector("body");
  const $restaurantHeader = RestaurantHeader();
  const $restaurantFilterTabs = RestaurantFilterTabs();
  const $restaurantFilterContainer = RestaurantFilterContainer();
  const $restaurantListContainer = RestaurantListContainer(
    [...filteredRestaurantDataList]
  );
  if (!isReRender) {
    $body.appendChild($restaurantHeader);
    $body.appendChild($restaurantFilterTabs);
    $body.appendChild($restaurantFilterContainer);
    $body.appendChild($restaurantListContainer);
  }
  if (isReRender) {
    reRenderRestaurantListContainer($body, $restaurantListContainer);
  }
  const $restaurants = document.querySelectorAll(".restaurant");
  $restaurants.forEach(($restaurant) => {
    $restaurant.addEventListener("click", (event2) => {
      const restaurantId = event2.target.closest(".restaurant").id;
      Modal({ component: () => RestaurantItemDetailModal({ restaurantId, isColumn: true }) });
    });
  });
}
function Input({ type, name, id, isRequired }) {
  const $input = createElement({
    tag: "input",
    type,
    name,
    id,
    required: isRequired
  });
  return $input;
}
function TextArea({ name, id, cols, rows }) {
  const $textarea = createElement({
    tag: "textarea",
    name,
    id,
    cols,
    rows
  });
  return $textarea;
}
function createHelpText(helpText) {
  const $span = createElement({
    tag: "span",
    classNames: ["help-text", "text-caption"]
  });
  $span.textContent = helpText;
  return $span;
}
function RestaurantFormModalItem({
  isRequired,
  name,
  text,
  renderChild,
  helpText
}) {
  const $div = createElement({
    tag: "div",
    classNames: ["form-item", `${isRequired && "form-item--required"}`]
  });
  const $label = createElement({
    tag: "label",
    for: `${name} text-caption`
  });
  $label.textContent = text;
  $div.appendChild($label);
  $div.appendChild(renderChild());
  if (helpText) {
    const $helpText = createHelpText(helpText);
    $div.appendChild($helpText);
  }
  return $div;
}
function RestaurantFormModalButtonContainer() {
  const $div = createElement({
    tag: "div",
    classNames: ["button-container"]
  });
  $div.appendChild(
    Button({
      variant: "secondary",
      type: "button",
      text: "취소하기",
      onClick: closeModal
    })
  );
  $div.appendChild(
    Button({
      variant: "primary",
      type: "submit",
      text: "추가하기"
    })
  );
  return $div;
}
function RestaurantFormModal() {
  function submitRestaurantForm(event2) {
    try {
      event2.preventDefault();
      const $form2 = document.querySelector(".form");
      const data = Object.fromEntries(new FormData($form2));
      restaurantDataList.addData(data);
      closeModal();
      Restaurant({ isReRender: true });
    } catch (e) {
      alert(e.message);
    }
  }
  const $fragment = document.createDocumentFragment();
  const $h2 = createElement({
    tag: "h2",
    classNames: ["modal-title", "text-title"]
  });
  const $form = createElement({
    tag: "form",
    classNames: ["form"]
  });
  $form.addEventListener("submit", submitRestaurantForm);
  $h2.textContent = "새로운 음식점";
  $fragment.appendChild($h2);
  $fragment.appendChild($form);
  $form.appendChild(
    RestaurantFormModalItem({
      isRequired: true,
      name: "category",
      text: "카테고리",
      renderChild: () => Select({
        name: "category",
        id: "category",
        options: ["한식", "중식", "일식", "양식", "아시안", "기타"],
        isRequired: true
      })
    })
  );
  $form.appendChild(
    RestaurantFormModalItem({
      isRequired: true,
      name: "name",
      text: "이름",
      renderChild: () => Input({
        type: "text",
        name: "name",
        id: "name",
        isRequired: true
      })
    })
  );
  $form.appendChild(
    RestaurantFormModalItem({
      isRequired: true,
      name: "distance",
      text: "거리(도보 이동 시간)",
      renderChild: () => Select({
        name: "distance",
        id: "distance",
        options: [5, 10, 15, 20, 30],
        isRequired: true
      })
    })
  );
  $form.appendChild(
    RestaurantFormModalItem({
      isRequired: false,
      name: "description",
      text: "설명",
      renderChild: () => TextArea({
        name: "description",
        id: "description",
        cols: "30",
        rows: "5"
      }),
      helpText: "메뉴 등 추가 정보를 입력해 주세요."
    })
  );
  $form.appendChild(
    RestaurantFormModalItem({
      isRequired: false,
      name: "link",
      text: "참고 링크",
      renderChild: () => Input({
        type: "text",
        name: "link",
        id: "link",
        isRequired: false
      }),
      helpText: "매장 정보를 확인할 수 있는 링크를 입력해 주세요."
    })
  );
  $form.appendChild(RestaurantFormModalButtonContainer());
  return $fragment;
}
window.addEventListener("load", () => {
  init();
});
function init() {
  Restaurant({
    isReRender: false
  });
  event();
}
function event() {
  const $button = document.querySelector(".gnb__button");
  $button.addEventListener("click", () => {
    Modal({
      component: RestaurantFormModal
    });
  });
}
