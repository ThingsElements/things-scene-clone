/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
import './util'

import { expect } from 'chai'

import '../../bower_components/things-scene-core/things-scene-min'
import { Clone } from '../../src/index'

describe('Clone', function () {

  var board;

  beforeEach(function () {
    board = scene.create({
      model: {
        components: [{
          id: 'clone',
          type: 'clone'
        }]
      }
    })
  });

  it('component should be found by its id.', function () {

    var component = board.findById('clone')

    expect(!!component).not.to.equal(false);
  });
});
