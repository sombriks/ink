import ActionType from '../action'
import util from '../util'
import yaml from 'js-yaml'
import _ from 'lodash'

let parseConfig = function(data, noContent) {
    let configStr
    if (noContent) {
        configStr = _.trim(data)
    } else {
        configStr = _.trim(data.split('---')[0] || '\n')
    }
    try {
        return yaml.safeLoad(configStr)
    } catch (err) {
        console.log(err)
        return null
    }
}

export function setHeader(data) {
    let config = parseConfig(data)
    return {
        type: ActionType.EDITOR_SET_HEADER,
        title: config ? config.title : '键入文章标题',
        tags: config ? config.tags : []
    }
}

export function setEditor(id, data) {
    let dataAry = data.split('---')
    let configData = _.trim(dataAry[0])
    let content = _.trim(dataAry[1] ? dataAry.slice(1).join('---') : '')
    let config = parseConfig(configData)
    let { title, tags } = config || {}
    return {
        type: ActionType.EDITOR_SET_CONTENT,
        id,
        title,
        tags,
        config: configData,
        content
    }
}

export function setCurrent(current) {
    return {
        type: ActionType.EDITOR_SET_CURRENT,
        current
    }
}

export function reset() {
    return {
        type: ActionType.EDITOR_RESET
    }
}

export function uploadImage(file, callback) {
    return dispatch => {
        const articleId = globalStore.getState().editor.get('id')
        let data = new FormData()
        data.append('file', file)
        data.append('article_id', articleId)
        util.apiRequest('POST', 'upload', data).then(function(data) {
            dispatch(util.showTip('auto', '已插入图片'))
            callback(data.path)
        }).catch((err) => {
            dispatch(util.showTip('auto', '图片上传失败'))
            callback()
        })
    }
}
