<template>
    <div ref="calendar" id="calendar"></div>
</template>

<script>
    // https://github.com/CroudTech/vue-fullcalendar#readme
    import defaultsDeep from 'lodash.defaultsdeep'
    import 'fullcalendar'
    import $ from 'jquery'
    import 'fullcalendar/dist/fullcalendar.css'

    export default {
        name: 'fullCalendar',
        props: {
            events: {
                default () {
                    return []
                }
            },

            eventSources: {
                default () {
                    return []
                }
            },

            editable: {
                default () {
                    return false
                }
            },

            selectable: {
                default () {
                    return true
                }
            },

            selectHelper: {
                default () {
                    return true
                }
            },

            header: {
                default () {
                    return {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'month,agendaWeek,agendaDay'
                    }
                }
            },

            defaultView: {
                default () {
                    return 'month'
                }
            },

            sync: {
                default () {
                    return false
                }
            },

            config: {
                type: Object,
                default () {
                    return {
                    }
                }
            }
        },

        computed: {
            defaultConfig () {
                const self = this
                return {
                    header: this.header,
                    defaultView: this.defaultView,
                    editable: this.editable,
                    selectable: this.selectable,
                    selectHelper: this.selectHelper,
                    aspectRatio: 2,
                    timeFormat: ' ',
                    // columnFormat: {month: 'ddd'},
                    events: this.events,
                    eventSources: this.eventSources,
                    
                    eventRender (...args) {
                        if (this.sync) {
                            self.events = cal.fullCalendar('clientEvents')
                        }
                        self.$emit('event-render', ...args)
                    },
                    eventAfterRender () {
                       
                    },
                    // 视图渲染
                    viewRender (...args) {
                        if (this.sync) {
                            self.events = cal.fullCalendar('clientEvents')
                        }
                        self.$emit('view-render', ...args)
                        $('.fc-prev-button').click(function () {
                            let year = $('#calendar').fullCalendar('getDate')._i[0]
                            let month = $('#calendar').fullCalendar('getDate')._i[1]
                            self.$emit('month-prev', year, month)
                        })
                        $('.fc-next-button').click(function () {
                            let year = $('#calendar').fullCalendar('getDate')._i[0]
                            let month = $('#calendar').fullCalendar('getDate')._i[1]
                            self.$emit('month-next', year, month)
                        })
                    },

                    eventDestroy (event) {
                        if (this.sync) {
                            self.events = cal.fullCalendar('clientEvents')
                        }
                    },

                    eventClick (...args) {
                        self.$emit('event-selected', ...args)
                    },

                    eventDrop (...args) {
                        self.$emit('event-drop', ...args)
                    },

                    eventReceive (...args) {
                        console.log(2)
                        self.$emit('event-receive', ...args)
                    },

                    eventResize (...args) {
                        self.$emit('event-resize', ...args)
                    },

                    dayClick (...args) {
                        self.$emit('day-click', ...args)
                    },
                    select (start, end, jsEvent, view, resource) {
                        self.$emit('event-created', {
                            start,
                            end,
                            allDay: !start.hasTime() && !end.hasTime(),
                            view,
                            resource
                        })
                    }
                }
            }
        },

        mounted () {
            const cal = $(this.$el),
                self = this

            this.$on('remove-event', (event) => {
                if (event && event.hasOwnProperty('id')) {
                    $(this.$el).fullCalendar('removeEvents', event.id)
                } else {
                    $(this.$el).fullCalendar('removeEvents', event)
                }
            })

            this.$on('rerender-events', () => {
                $(this.$el).fullCalendar('rerenderEvents')
            })

            this.$on('refetch-events', () => {
                $(this.$el).fullCalendar('refetchEvents')
            })

            this.$on('render-event', (event) => {
                $(this.$el).fullCalendar('renderEvent', event)
            })

            this.$on('reload-events', () => {
                $(this.$el).fullCalendar('removeEvents')
                $(this.$el).fullCalendar('addEventSource', this.events)
            })

            this.$on('rebuild-sources', () => {
                $(this.$el).fullCalendar('removeEventSources')
                this.eventSources.map(event => {
                    $(this.$el).fullCalendar('addEventSource', event)
                })
            })
            
            cal.fullCalendar(defaultsDeep(this.config, this.defaultConfig))
        },

        methods: {
            fireMethod (...options) {
                return $(this.$el).fullCalendar(...options)
            }
        },

        watch: {
            events: {
                deep: true,
                handler (val) {
                    $(this.$el).fullCalendar('removeEvents')
                    $(this.$el).fullCalendar('addEventSource', this.events)
                }
                
            },
            eventSources: {
                deep: true,
                handler (val) {
                    this.$emit('rebuild-sources')
                }
            }
        },
        updated () {
            
        },
        beforeDestroy () {
            this.$off('remove-event')
            this.$off('rerender-events')
            this.$off('refetch-events')
            this.$off('render-event')
            this.$off('reload-events')
            this.$off('rebuild-sources')
        }
    }
</script>
