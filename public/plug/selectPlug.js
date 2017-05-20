/**
 * Created by liaocan on 2017/3/19.
 * 下拉列表及多级菜单  基于jquery
 */
(function($){
    //初始化对象
    var selectObj = function (elm) {
        this.element = elm;
    }

    selectObj.prototype = {
        selectPlug:function(elm){

            /*鼠标悬浮*/
            elm.off('mouseover',' .sewv ').on('mouseover',' .sewv',function (e) {
                $(this).find('.content').show(150);
            });

            /*鼠标离开*/
             elm.off('mouseleave',' .sewv ').on('mouseleave',' .sewv ',function (e) {
                 $(this).find('.content').hide(150);
             });

            /*鼠标悬浮*/
            elm.off('mouseover',' .sewv-pl  ').on('mouseover',' .sewv-pl ',function (e) {
                $(this).find('.content').show(150);
            });

            /*鼠标离开*/
            elm.off('mouseleave',' .sewv-pl  ').on('mouseleave',' .sewv-pl  ',function (e) {
                $(this).find('.content').hide(150);
            });

            /*下拉列表选择单击事件*/
            elm.off('click',' .sewvbm > li').on('click',' .sewvbm > li',function () {
                var selva = $(this).text();
                $(this).parents('.content').prev().find('span').text(selva);
                $(this).parents('.content').prev().find('span').css('color','#666');
                $(this).parents('.content').prev().find('input').val(selva).trigger('change');
                $(this).parents(".content").hide();

            })

            /*鼠标悬浮显示下级菜单*/
            elm.off('mouseover','.more').on('mouseover','.more',function () {
                /*获取父级li标签宽度和高度*/
                $(this).children('ul').show();
                $(this).children('ul').css('margin-left', $(this).width())
                $(this).focus().addClass('focusa');

            })

            /*鼠标离开下级菜单消失*/
            elm.off('mouseleave','.more').on('mouseleave','.more',function () {
                $(this).children('ul').hide();
                $(this).focus().removeClass('focusa');
            })
        }
    }

    /*初始化*/
    $.fn.selectPlug = function(){
        //在插件中使用obj对象
        var obj = new selectObj();

        //调用其方法
        obj.selectPlug(this);

        return this;
    };
})(jQuery, window, document);