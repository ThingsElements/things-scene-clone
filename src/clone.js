const NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties : [{
    type: 'number',
    label: 'duration',
    name: 'duration',
    property: 'duration'
  },{
    type: 'string',
    label: 'target',
    name: 'target',
    property: 'target'
  },{
    type: 'boolean',
    label: 'repeat',
    name: 'repeat',
    property: 'repeat'
  },{
    type: 'boolean',
    label: 'autostart',
    name: 'autostart',
    property: 'autostart'
  },{
    type: 'number',
    label: 'targetRetension',
    name: 'targetRetension',
    property: 'targetRetension'
  }]
}

var { RectPath, Shape, Model } = scene

function clone(cloner, target, targetRetension) {

  var targetComponent = cloner.root.findById(target);
  if(!targetComponent)
    return

  var clone = Object.assign(targetComponent.hierarchy, {
    templatePrefix: ''
  })
  delete clone.id;
  delete clone.templatePrefix;
  if(targetRetension)
    clone.retension = targetRetension;

  var component = Model.compile(clone, cloner.app)
  var index = cloner.parent.indexOf(component + 1)
  targetComponent.parent.insertComponentAt(component, index)

  setTimeout(() => {
    component.hidden = false;
  }, 1)
  // component.started = true;
  // component._animation('oncreate').started = true;

  return component;
}

export default class Clone extends RectPath(Shape) {

  added(parent) {
    this.started = false;
    setTimeout(() => {
      if(this.get('autostart'))
        this.started = true
    }, 500)
  }

  disposed() {
    this
  }

  get hidden() {
    return true;
  }

  get nature(){
    return NATURE;
  }

  get started() {
    return this._started;
  }

  set started(started) {
    if(this.started === !!started)
      return;

    this._started = started;

    if(!!this._started) {
      var {
        repeat,
        duration,
        target,
        targetRetension
      } = this.model;

      if(!target)
        return

      if(duration < 500)
        duration = 500

      let self = this;

      function _() {
        if(!self._started || !clone(self, target, targetRetension) || !duration || !repeat) {
          self._started = false;
          return
        }

        setTimeout(() => {
          requestAnimationFrame(_)
        }, duration)
      }

      requestAnimationFrame(_)
    }
  }
}

scene.Component.register('clone', Clone);
