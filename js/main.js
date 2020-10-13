$(document).ready(function () {

    function getJson() {

    }


    $(document).on('input', 'input', function () {
        const mask = $(this).data('mask')
        const regExpTemplate = mask.replaceAll('(', '').replaceAll(')', '').replaceAll('-', ')(').replaceAll(' ', ')(').replace(/$/, ')').replace(/^/, '(').replace(/\+/, '').replaceAll(/[0-9]/g, '[0-9]')
        console.log(regExpTemplate)
        let insertTemplate = mask.replaceAll(/[0-9]+/g, '#')

        let index = 1
        while (insertTemplate.search('#') + 1) {
            insertTemplate = insertTemplate.replace('#', '$' + index)
            index++
        }

        const re = new RegExp(regExpTemplate)

        $(this).val($(this).val().replace(re, insertTemplate))
    })

    const input = {
        checkRequired(element) {
            if (element.input.required) {
                return 'required'
            } else return String()
        },
        getId() {
            return Math.round(Math.random() * 100000000)
        },
        default (element) {
            const id = this.getId()
            const placeholder = element.input.placeholder ? `placeholder="${element.input.placeholder}"` : String()
            const mask = element.input.mask ? `data-mask="${element.input.mask}"` : String()
            const maxLength = element.input.mask ? `maxLength="${element.input.mask.length}"` : String()
            const pattern = (element.input.type == 'tel') ? 'pattern="[0-9\-]+"' : String()
            const html =
                `<div class="form-group">
                    <label for="field-${id}">${element.label}</label>
                    <input type="${element.input.type}" class="form-control" id="field-${id}" ${this.checkRequired(element)} ${placeholder} ${mask} ${pattern} ${maxLength}>
                </div>`
            return html
        },
        file(element) {
            const id = this.getId()
            const multiple = element.input.multiple ? 'multiple' : String()
            const accept = element.input.filetype ? `accept="${element.input.filetype.join(', ')}"` : String()
            const html =
                `<div class="form-group">
                    <label for="field-${id}">${element.label}</label>
                    <input type="${element.input.type}" class="form-control-file" id="field-${id}" ${accept} ${multiple} ${this.checkRequired(element)}>
                </div>`
            return html
        },
        textarea(element) {
            const id = this.getId()
            const html =
                `<div class="form-group">
                    <label for="field-${id}">${element.label}</label>
                    <textarea class="form-control" id="field-${id}" rows="3" ${this.checkRequired(element)}></textarea>
                </div>`
            return html
        },
        checkbox(element) {
            const id = this.getId()
            const checked = (element.input.checked == 'true') ? 'checked' : String()
            const html =
                `<div class="form-group form-check">
                    <input type="${element.input.type}" class="form-check-input" id="field-${id}" ${this.checkRequired(element)} ${checked}>
                </div>`
            return html
        },

        number(e) {
            e.input.type = 'tel'
            return this.default(e)
        },
        text(e) {
            return this.default(e)
        },
        email(e) {
            return this.default(e)
        },
        date(e) {
            return this.default(e)
        },

        technology(element) {
            const id = this.getId()
            const multiple = element.input.multiple ? 'multiple' : String()

            let options = String()
            element.input.technologies.forEach(item => {
                options += `<option>${item}</option>`
            })

            const html = 
                `<div class="form-group">
                    <label for="field-${id}">${element.label}</label>
                    <select class="form-control" id="field-${id}" ${multiple} ${this.checkRequired(element)}>
                        ${options}
                    </select>
                </div>`
            
            return html
        }
    }



    const ref = {
        handle(references) {
            let id = String()
            let html = String()
            references.forEach(element => {
                if (element.input) {
                    id = input.getId()
                    const checked = (element.input.checked == 'true') ? 'checked' : String()
                    html += `<input class="form-check-input" type="checkbox" id="${id}" ${checked} ${input.checkRequired(element)}>`
                } else {
                    html += `<label class="form-check-label" for="${id}">${element['text without ref']}</label>`
                    html += `<a href="${element.ref}">${element.text}</a>`
                }
            })
            return `<div class="form-check">${html}</div>`
        }
    }

    const button = {
        handle(element) {
            return `<button type="button" class="btn btn-primary">${element.text}</button>`
        }
    }






    $('#btn').click(() => {
        let file = document.getElementById('file').files[0]

        console.log(file)

        const reader = new FileReader()

        reader.readAsText(file)

        reader.onload = () => {
            const formJSON = JSON.parse(reader.result)
            let formHTML = String()
            console.log(formJSON)

            formJSON.fields.forEach(element => {
                formHTML += input[element.input.type](element)
            });

            // formJSON.references.forEach(element => {
            //     if (element.input) {
            //         formHTML += input[element.input.type](element)
            //     } else {

            //     }
            // })

            formHTML += ref.handle(formJSON.references)

            formJSON.buttons.forEach(element => {
                formHTML += button.handle(element)
            });

            $('form').html(formHTML)
        }
    })
})