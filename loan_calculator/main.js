//Максимальная и минимальная сумма кредита
const CREDIT_MIN = 0
const CREDIT_MAX = 15000000
//Максимальная и минимальная сумма первого взноса
const СONTRIBUTION_MIN = 0
const СONTRIBUTION_MAX = 15000000
//Максимальное и минимальное количество месяцев
const TERM_MIN = 1
const TERM_MAX = 30

//Инпут и ползунок суммы кредита
const inputPrice = document.querySelector('#inputPrice')
const inputPriceRange = document.querySelector('#inputPriceRange')
//Инпут и ползунок суммы первого взноса
const inputСontribution = document.querySelector('#inputСontribution')
const inputСontributionRange = document.querySelector('#inputСontributionRange')
//Инпут и ползунок количества мксяцев
const inputTerm = document.querySelector('#inputTerm')
const inputTermRange = document.querySelector('#inputTermRange')
//Инпут и ползунок процентов
const inputPercent = document.querySelector('#inputPercent')
//Итоговая сумма в месяц
let itog = document.querySelector('#itog')
//Общяя сумма
let ob_itog = document.querySelector('#ob_itog')
//Переплата
let pereplata = document.querySelector('#pereplata')

const formaterNumber = new Intl.NumberFormat('ru')

const formaterCurrency = new Intl.NumberFormat('ru', {
	style: 'currency',
	currency: 'RUB',
	minimumFractionDigits: 0
})

const formatorDate = {
	format (years){
		years = parseInt(years)
		let count = years % 10
		let txt = 'лет'
		if (years >= 5 && years <= 20) {
			txt = 'лет'
		} else {
			if (years == 1) {
				txt = 'год'
			} else {
				if (years >= 2 && years <= 4) {
					txt = 'года'
				}
			}

		}
		return years + ' ' + txt
	}
}

//Главная функция
function mayCalc (textElement,rangeElement,formator,formatorCur,min,max) {
	const midle = (min + max) / 2
	rangeElement.setAttribute('min', min)
	rangeElement.setAttribute('max', max)
	textElement.value = formatorCur.format(parseInt(midle))
	rangeElement.value = midle

	textElement.addEventListener('focus',function(event){
		let number = ''
		for (const letter of this.value) {
			if ('1234567890'.includes(letter)) {
				number += letter
			}
		}
		number = parseInt(number)
		this.value = formator.format(number)

	})
		

	textElement.addEventListener('input',function(event) {
		let number = ''
		for (const letter of this.value) {
			if ('1234567890'.includes(letter)) {
				number += letter
			}
		}
		number = parseInt(number)

		if (number < min) {
			number = min
		}

		if (number > max) {
			number = max
		}

		rangeElement.value = number

		number = formator.format(number)

		this.value = number

	})

	textElement.addEventListener('blur',function (event){
		let number = ''
		for (const letter of this.value) {
			if ('1234567890'.includes(letter)) {
				number += letter
			}
		}
		number = parseInt(number)
		this.value = formatorCur.format(number)
	})

	rangeElement.addEventListener('input',function(event){
		textElement.value = formatorCur.format(parseInt(this.value))
	})
}

//Вызов функций
mayCalc(inputPrice,inputPriceRange,formaterNumber,formaterCurrency,CREDIT_MIN,CREDIT_MAX)
mayCalc(inputСontribution,inputСontributionRange,formaterNumber,formaterCurrency,СONTRIBUTION_MIN,СONTRIBUTION_MAX)
mayCalc(inputTerm,inputTermRange,formaterNumber,formatorDate,TERM_MIN,TERM_MAX)
setReaction(
	inputPrice,
	inputPriceRange,
	inputСontribution,
	inputСontributionRange,
	inputTerm,
	inputTermRange,
	raschet//Функция расчетов
)

//Вызов функции для изменения параметров по умолчанию в верстке
raschet()

//Функция по отслеживанию изменений в значениях инпутов
function setReaction(...args){
	const hendler = args.splice(-1)[0]

	for (const element of args){
		element.addEventListener('input',function(event){
			hendler.call(this,event,args.slice())
		})
	}
}

//Функция расчетов
function raschet() {
	const inputPrice = parseInt(inputPriceRange.value)
	const inputСontribution = parseInt(inputСontributionRange.value)
	const inputTerm = parseInt(inputTermRange.value)
	let persend = 10 + Math.log(inputTerm) / Math.log(0.5)
	persend = parseInt(persend * 100 + 1) / 100
	inputPercent.value = persend  + '%'
	let comonDebet = (inputPrice - inputСontribution) * (1 + persend) ^ inputTerm
	ob_itog.textContent = formaterCurrency.format(comonDebet)
	let pereplat = comonDebet - (inputPrice - inputСontribution)
	pereplata.textContent = formaterCurrency.format(pereplat)
	let itogMoon = pereplat / (inputTerm * 12)
	itog.textContent = formaterCurrency.format(itogMoon)
}
