var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _id, _src, _alt, _name, _distance, _description, _link, _category, _dataList;
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
function RestaurantItem({
  src,
  alt,
  name,
  distance,
  description
}) {
  const $restaurantItem = createElement({
    tag: "li",
    classNames: ["restaurant"]
  });
  $restaurantItem.innerHTML = `
        <div class="restaurant__category">
            <img src=${src} alt=${alt} class="category-icon">
          </div>
          <div class="restaurant__info">
            <h3 class="restaurant__name text-subtitle">${name}</h3>
            <span class="restaurant__distance text-body">${distance}</span>
            <p class="restaurant__description text-body">${description}</p>
        </div>`;
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
    ({ src, alt, name, distance, description }) => RestaurantItem({ src, alt, name, distance, description })
  );
  $restaurantList.append(...restaurantElements);
  $restaurantListContainer.appendChild($restaurantList);
  return $restaurantListContainer;
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
  constructor({ id, name, distance, description = "", link = "", category }) {
    __privateAdd(this, _id);
    __privateAdd(this, _src);
    __privateAdd(this, _alt);
    __privateAdd(this, _name);
    __privateAdd(this, _distance);
    __privateAdd(this, _description);
    __privateAdd(this, _link);
    __privateAdd(this, _category);
    this.validateCategory(category);
    this.validateDistance(distance);
    this.validateName(name);
    __privateSet(this, _id, id && crypto.randomUUID());
    __privateSet(this, _src, CATEGORY_IMAGE[category]);
    __privateSet(this, _alt, category);
    __privateSet(this, _name, name);
    __privateSet(this, _distance, distance);
    __privateSet(this, _description, description);
    __privateSet(this, _link, link);
    __privateSet(this, _category, category);
  }
  getData() {
    return {
      id: __privateGet(this, _id),
      alt: __privateGet(this, _alt),
      src: __privateGet(this, _src),
      name: __privateGet(this, _name),
      distance: __privateGet(this, _distance),
      description: __privateGet(this, _description),
      link: __privateGet(this, _link),
      category: __privateGet(this, _category)
    };
  }
  isValidateOption(value) {
    return !value;
  }
  isValidateName(name) {
    return name.length < 2;
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
_id = new WeakMap();
_src = new WeakMap();
_alt = new WeakMap();
_name = new WeakMap();
_distance = new WeakMap();
_description = new WeakMap();
_link = new WeakMap();
_category = new WeakMap();
class RestaurantDataList {
  constructor(dataList) {
    __privateAdd(this, _dataList);
    __privateSet(this, _dataList, dataList.map((data) => {
      return this.createData(data);
    }));
  }
  getDataList() {
    return __privateGet(this, _dataList).map((restaurantData) => restaurantData.getData());
  }
  addData(data) {
    __privateGet(this, _dataList).push(this.createData(data));
  }
  createData(data) {
    return new RestaurantData({
      id: data.id,
      name: data.name,
      distance: data.distance,
      description: data.description,
      link: data.link,
      category: data.category
    });
  }
}
_dataList = new WeakMap();
const dummy = [
  {
    category: "한식",
    name: "피양콩할마니",
    distance: "캠퍼스부터 10분 내",
    description: "평양 출신의 할머니가 수십 년간 운영해온 비지 전문점 피양콩 할마니. 두부를 빼지 않은 되비지를 맛볼 수 있는 곳으로, ‘피양’은 평안도 사투리로 ‘평양’을 의미한다. 딸과 함께 운영하는 이곳에선 맷돌로 직접 간 콩만을 사용하며, 일체의 조미료를 넣지 않은 건강식을 선보인다. 콩비지와 피양 만두가 이곳의 대표 메뉴지만, 할머니가 옛날 방식을 고수하며 만들어내는 비지전골 또한 이 집의 역사를 느낄 수 있는 특별한 메뉴다. 반찬은 손님들이 먹고 싶은 만큼 덜어 먹을 수 있게 준비돼 있다"
  },
  {
    category: "양식",
    name: "파스타",
    distance: "캠퍼스부터 10분 내",
    description: "레전드 파스타 맛집"
  },
  {
    category: "일식",
    name: "참치방어스시",
    distance: "캠퍼스부터 10분 내",
    description: "참치와 방어가 맛있는 참지입니다. 또 가고 싶어요"
  }
];
const restaurantDataList = new RestaurantDataList(dummy);
function Restaurant() {
  const $body = document.querySelector("body");
  const $restaurantHeader = RestaurantHeader();
  const $restaurantListContainer = RestaurantListContainer(
    restaurantDataList.getDataList()
  );
  $body.appendChild($restaurantHeader);
  $body.appendChild($restaurantListContainer);
}
function Select({
  name,
  id,
  classNames = [],
  options,
  isRequired = false
}) {
  const $select = createElement({
    tag: "select",
    name,
    id,
    classNames,
    required: isRequired
  });
  const $options = createOptions(options);
  $select.appendChild($options);
  return $select;
}
function createOptions(options) {
  const $fragment = document.createDocumentFragment();
  const $defaultOption = createElement({
    tag: "option",
    value: ""
  });
  $defaultOption.textContent = "선택해 주세요.";
  $fragment.appendChild($defaultOption);
  options.forEach((option) => {
    const $option = createElement({ tag: "option", value: option });
    $option.textContent = option;
    $fragment.appendChild($option);
  });
  return $fragment;
}
function createHelpText(helpText) {
  const $span = createElement({
    tag: "span",
    classNames: ["help-text", "text-caption"]
  });
  $span.textContent = helpText;
  return $span;
}
function RestaurantModalItem({
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
function reset() {
  document.querySelector("body").innerHTML = "";
}
function RestaurantModalButtonContainer() {
  const $div = createElement({
    tag: "div",
    classNames: ["button-container"]
  });
  function handleClickCancel() {
    document.querySelector(".modal").remove();
  }
  $div.appendChild(
    Button({
      variant: "secondary",
      type: "button",
      text: "취소하기",
      onClick: handleClickCancel
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
function RestaurantModal() {
  const $fragment = document.createDocumentFragment();
  const $h2 = createElement({
    tag: "h2",
    classNames: ["modal-title", "text-title"]
  });
  const $form = createElement({
    tag: "form",
    classNames: ["form"]
  });
  $form.addEventListener("submit", function handleClickAdd(event2) {
    try {
      event2.preventDefault();
      const $form2 = document.querySelector(".form");
      const data = Object.fromEntries(new FormData($form2));
      restaurantDataList.addData(data);
      reset();
      init();
    } catch (e) {
      alert(e.message);
    }
  });
  $h2.textContent = "새로운 음식점";
  $fragment.appendChild($h2);
  $fragment.appendChild($form);
  $form.appendChild(
    RestaurantModalItem({
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
    RestaurantModalItem({
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
    RestaurantModalItem({
      isRequired: true,
      name: "distance",
      text: "거리(도보 이동 시간)",
      renderChild: () => Select({
        name: "distance",
        id: "distance",
        options: ["5분 내", "10분 내", "15분 내", "20분 내", "30분 내"],
        isRequired: true
      })
    })
  );
  $form.appendChild(
    RestaurantModalItem({
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
    RestaurantModalItem({
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
  $form.appendChild(RestaurantModalButtonContainer());
  return $fragment;
}
function Modal(component) {
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
window.addEventListener("load", () => {
  init();
});
function init() {
  Restaurant();
  event();
}
function event() {
  const $button = document.querySelector(".gnb__button");
  $button.addEventListener("click", () => {
    Modal(RestaurantModal);
  });
}
