<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="modal-header">
                        <slot name="header">
                            default header
                        </slot>
                    </div>
                    <div class="modal-body">
                        <slot name="body">
                            default body
                        </slot>
                    </div>
                    <div class="modal-footer">
                        <slot name="footer">
                            <div class="btn-group">
                                <button class="btn btn-default" id="modal_footer_cancel" @click="$emit('close')">{{cancelText}}</button>
                                <button class="btn btn-primary" id="modal_footer_confirm" @click="$emit('close')">{{confirmText}}</button>
                            </div>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<style>
.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
}

.modal-wrapper {
    display: table-cell;
    vertical-align: top;
    padding-top: 70px;
}

.modal-container {
    width: 500px;
    margin: 0px auto;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
    margin-top: 0;
    margin-bottom: 0;
    color: #42b983;
    text-align: left;
}

.modal-body {
    text-align: left;
    margin: 0;
}

.modal-default-button {
    float: right;
}
.modal-enter {
    opacity: 0;
}

.modal-leave-active {
    opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}
</style>
<script>
    export default{
        props: {
            cancelText: {
                type: String,
                default: 'Cancel'
            },
            confirmText: {
                type: String,
                default: 'Ok'
            }
        }
    }
</script>
