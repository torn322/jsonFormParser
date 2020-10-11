$(document).ready(function () {

    function getJson() {
        
    }


    $(document).on('input', 'input', function () {
        const mask = '(999) 99-99-999'
        const regExpTemplate = mask.replaceAll('(', '').replaceAll(')', '').replaceAll('-', ')(').replaceAll(' ', ')(').replace(/$/, ')').replace(/^/, '(').replaceAll(/[0-9]/g, '[0-9]')
        let insertTemplate  = mask.replaceAll(/[0-9]+/g, '#')

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
        default(element) {
            const id = this.getId()
            const html =  
                `<div class="form-group">
                    <label for="field-${id}">${element.label}</label>
                    <input type="${element.input.type}" class="form-control" id="field-${id}" ${this.checkRequired(element)}>
                </div>`
            return html
        },
        file(element) {
            const id = this.getId()
            const html = 
                `<div class="form-group">
                    <label for="field-${id}">${element.label}</label>
                    <input type="${element.input.type}" class="form-control-file" id="field-${id}" ${this.checkRequired(element)}>
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

        text(e) { return this.default(e) },
        number(e) { return this.default(e) },
        email(e) { return this.default(e) },
        date(e) {return this.default(e) } 
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

            // formJSON.buttons.forEach(element => {
                
            // });

            $('form').html(formHTML)
        }
    })
})