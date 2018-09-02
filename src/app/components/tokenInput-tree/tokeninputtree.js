! function($) {
  var config = {
    membersp: 'p'
  }
  var pnode = function(item, options) {
    return options || (options = {}), {
      id: item.id,
      parent: item.parentid || "#",
      text: item.name,
      visitor:item.visitor,
      type:item.type,
      icon:item.icon,
      relaid:item.relaid,
      state: {
        opened: options.selected ? item.id == options.selected || (options.selected == -1 && 0 == item.parentid) : 0 == item.parentid,
        disabled: item.is_readonly,
        selected: $.inArray(item.id, options.selected) > -1
      },
      wid: item.wid
    }
  };
  var ptoke = function(item, options) {
    options || (options = {});
    var obj = {
      id: item.id,
      name: item.name,
      visitor:item.visitor,
      relaid:item.relaid,
      type:item.type,
      icon:item.icon,
      keywords: [item.name, item.pinyinname],
      wid: item.wid,
      readonly: options.readonly
    };
    item.name && obj.keywords.push(item.name);
    item.pinyinname && obj.keywords.push(item.pinyinname);
    return options, obj;
  }
  var mtoke = function(item, options) {
    options || (options = {});
    var obj = {
      id: config.membersp + item.id,
      name: item.username,
      visitor:item.visitor,
      username: item.username,
      relaid:item.relaid,
      icon:item.icon,
      type:item.type,
      keywords: [],
      thumb_path: item.thumb_path,
      readonly: options.readonly,
      JoinStatus: item.JoinStatus
    };
    item.username && obj.keywords.push(item.username);
    item.pinyinname && obj.keywords.push(item.pinyinname);
    item.bizmpid && obj.keywords.push(item.bizmpid);
    return options, obj;
  }
  $.tokenInputConverter = {
    party2node: function(item, options) {
      return pnode(item, options)
    },
    forparty2node: function(data, options) {
      var d = [];
      $.each(data, function(index, item) {
        d.push(pnode(item, options));
      });
      return d;
    },
    party2token: function() {
      return ptoke(item, options)
    },
    forparty2token: function(data, options) {
      var d = [];
      $.each(data, function(index, item) {
        d.push(ptoke(item, options));
      });
      return d;
    },
    member2token: function(data, options) {
      return mtoke(data, options)
    },
    formember2token: function(data, options) {
      var d = [];
      $.each(data, function(index, item) {
        d.push(mtoke(item, options));
      });
      return d;
    },
    membersForValue: function(c) {
      var d = c.split(","),
        e = [];
      return a.each(d, function(a, c) {
        c && c[0] != b && e.push(c)
      }), e
    },
    partiesForValue: function(c) {
      var d = c.split(","),
        e = [];
      return a.each(d, function(a, c) {
        c && c[0] == b && e.push(c.substr(1))
      }), e
    }
  }
}(jQuery);



!(function($) {
  var config = {
    membersp: 'p'
  }
  var HTML_ESCAPES = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };

  var HTML_ESCAPE_CHARS = /[&<>"'\/]/g;

  function _escapeHTML(text) {
    return text.replace(HTML_ESCAPE_CHARS, function(match) {
      return HTML_ESCAPES[match];
    });
  }

  var methods = {
    init: function(tokendata, jstreedata, options, selected) {
      var $this = this,
        org = $this.data("organization");
      var jstree_init = function(dropdown) {
        if (!$this.data("jstree")) {
          var js_tree_el = $('<div class="token-input-jstree">token-input-jstree</div>').appendTo(dropdown).on("select_node.jstree", function(e, data) {
            $this.data("tokeninput").tokenInput("add", {
              id: data.node.id,
              name: data.node.text,
              visitor:data.node.original.visitor,
              relaid:data.node.original.relaid,
              type:data.node.original.type
            })
          });
          js_tree_el.jstree({
            core: {
              themes: {
                name: false,
                url: false,
                dir: false,
                icons: true,
                variant: false,
                stripes: false,
                responsive: true,
                dots: true
              },
              data: jstreedata
            },
            types: {
              'default': {
                'icon': 'icon icon_folder_blue'
              }
            },
            plugins: ["wholerow", "types","data"]
          });
          $this.data("jstree", js_tree_el);

        }
      }

      var member_resultsFormatter = function(item) {
        var id = item.id.toString(),
          name = item.name;
        if (id[0] == config.membersp) {
          return "<li><img src='" + item.thumb_path + "' style='float:left;width:26px;height:26px;margin-right:6px'><span>" + (this.enableHTML ? name : _escapeHTML(name)) + "</span></li>"

        } else {
          return "<li><i style='color:#C9DDF6;' class='fa fa-folder m-r-xs'></i>" + (this.enableHTML ? name : _escapeHTML(name)) + "</li>";
        }
      }
      var member_tokenFormatter = function(item) {
        var id = item.id.toString(),
          name = item.name;
        if (id[0] == config.membersp) {
          return "<li><img src='" + item.thumb_path + "' style='float:left;width:26px;height:26px'><p class='group_item_name'>" + (this.enableHTML ? name : _escapeHTML(name)) + "</p></li>"

        } else {
          return "<li><p class='group_item_name'><i style='color:#6EA6E7;' class='fa fa-folder m-r-xs'></i>" + (this.enableHTML ? name : _escapeHTML(name)) + "</p></li>";
        }
      }
      var defaults = {
        propertyToSearch: "keywords",
        searchDelay: 50,
        searchingText: null,
        resultsLimit: 20,
        excludeCurrent: true,
        preventDuplicates: true,
        animateDropdown: false,
        hintText: org ? "输入搜索条件" : (jstreedata && jstreedata.length ? jstree_init : "请输入目录名称"),
        resultsFormatter: member_resultsFormatter,
        tokenFormatter: member_tokenFormatter
      };

      options = $.extend({}, defaults, options);
      var tokenInput = $this.tokenInput(tokendata, options);
      if (selected) {
        $.each(jstreedata, function(index, item) {
          if ($.inArray(item.id, selected) > -1) {
            tokenInput.tokenInput("add", {
              id: item.id.toString(),
              name: item.text,
              visitor:item.visitor,
              relaid:item.relaid,
              type:item.type,
              wid: item.wid
            })
          }
        });
      }
      $this.data("tokeninput", tokenInput)
    },
    destroy: function() {
      this.data("jstree") && (this.data("jstree").jstree().destroy(), this.removeData("jstree")), this.data("tokeninput") && (this.data("tokeninput").tokenInput("destroy"), this.removeData("tokeninput"))
    },
    addtoken: function(data) {

    }
  }
  $.fn.tokenInputTree = function(t) {
    return methods[t] ? methods[t].apply(this, Array.prototype.slice.call(arguments, 1)) : methods.init.apply(this, arguments)
  }

})(jQuery);

angular.module('ngTicket').directive('tokeninputTree', ['$rootScope', function($rootScope) {
  return {
    restrict: 'AE',
    require: 'ngModel',
    scope: {
      costom: "&"
    },
    link: function(scope, iElement, iAttrs, ngModelCtrl) {
      var $this = $(iElement),
        path = $this.data("path"),
        contact = $this.data("contact"),
        selected = $this.data("selected"),
        selectedContact = $this.data("selectedContact"),
        tokenLimit = $this.data("tokenLimit"),
        part = $this.data("part"),
        submit = $this.data("submit"),
        organization = $this.data("organization"),
        member = $this.data("member"),
        submitcss = "";
      if (submit) {
        submitcss = submit;
      } else {
        submitcss = "js_no_submit_css";
        submit = "js_space_tree_placeholder"
      }

      var selectedContact_Checked = function(data) {
        var selected_arr = [];
        if (selectedContact) {
          selected_arr = selectedContact.split(',');
        }
        $.each(data, function(index, item) {
          if ($.inArray(item.id, selected_arr) > -1) {
            $this.tokenInput("add", item)
          }
        });
      }

      var reflect = function(results) {

        scope.$apply(function() {
          ngModelCtrl.$setViewValue(iElement.tokenInput("get"));
          scope.costom();
        });

      };
      if (path) {
        $.ajax(path, {
          type: 'post',
          data: part ? {
            department: selected
          } : false,
          beforeSend: function(request) {
            request.setRequestHeader("Authorization", "Bearer "+$rootScope.locals.access_token);
          },
          dataType: "json"
        }).done(function(result) {
          $this.tokenInputTree($.tokenInputConverter.forparty2token(result), $.tokenInputConverter.forparty2node(result), {
            classes: {
              dropdown: "token-input-dropdown memberDialog_selectTree " + submitcss + ""
            },
            onAdd: reflect,
            onDelete: reflect,
            tokenLimit: tokenLimit || 999
          }, ngModelCtrl.$viewValue || [])
        })


        // if (contact) {
        //     method.get(contact, function(presult) {
        //         var set = $this.data("settings");
        //         var contact_vals = $.tokenInputConverter.formember2token(presult);
        //         set.local_data = set.local_data.concat(contact_vals);
        //         selectedContact_Checked(contact_vals);
        //     }, false, part ? {
        //         department: selected,
        //         member: selectedContact
        //     } : false)
        // };


      } else {
        // if (contact) {
        //     method.get(contact, function(result) {
        //         var contact_vals = $.tokenInputConverter.formember2token(result);
        //         $this.tokenInputTree(contact_vals, 0, {
        //             classes: {
        //                 dropdown: "token-input-dropdown memberDialog_selectTree " + submitcss + ""
        //             },
        //             onAdd: function(item) {
        //                 if (member) {
        //                     var $itme = $("#members_" + item.id, $(member));
        //                     $itme.addClass("selected");
        //                     $("input[type='checkbox']", $itme).prop("checked",true);
        //                 }


        //             },
        //             onDelete: function(item) {
        //                 if (member) {
        //                     var $itme = $("#members_" + item.id, $(member));
        //                     $itme.removeClass("selected");
        //                     $("input[type='checkbox']", $itme).prop("checked",false);
        //                 }

        //             },
        //             tokenLimit: tokenLimit || 999
        //         }, 0)
        //         selectedContact_Checked(contact_vals);
        //     }, false, part ? {
        //         department: selected,
        //         member: selectedContact
        //     } : false)
        // }
      }
      // $this.closest('form').on("click", 'button[type="submit"],[data-toggle="method"]', function(e) {
      //     if ($this.data("ruleRequired") && !$this.prev(".token-input-list").is(":hidden")) {
      //         if ($this.tokenInput("get").length == 0) {
      //             var str1 = "请选择{0}{1}";
      //             var str2 = path ? "部门" : "";
      //             var str3 = path ? (contact ? "或人员" : "") : (contact ? "人员" : "")
      //             var strmsg = str1.format(str2, str3);
      //             var msg = $this.data("requiredMsg")

      //             config.msg.info(msg || strmsg);
      //             window.formValided = false;
      //             return false;
      //         };
      //     };
      // })
      // $(document).on("click","."+submit+" .jstree-node",function(){
      //     if(!$(this).find(".jstree-disabled").length){
      //         setTimeout(function(){
      //             $this.closest('form').submit();
      //         },200);

      //     }

      // });


    }


  }
}])
angular.module('ngTicket').directive('jsTree', ['$rootScope', function($rootScope) {
  return {
    restrict: 'AE',
    require: '?ngModel',
    scope: {
      costom: "&",
      selected:"=?"
    },
    link: function(scope, iElement, iAttrs, ngModelCtrl) {
        var $this =  $(iElement),
          path = $this.data("methodPath"),
          isedit = $this.data("edit");

      if (path) {
        $.ajax(path, {
          type: 'post',
          beforeSend: function(request) {
            request.setRequestHeader("Authorization","Bearer "+$rootScope.locals.access_token);
          },
          dataType: "json"
        }).done(function(result) {
          angular.forEach(result.data, function(item) {
            if (item.type=="plan") {
              item.icon = "icon testing_plan";
            }else if(item.type=="product"){
              item.icon = "icon testing_product";
            }
            if(item.type==iAttrs.readonlyType){
              item.is_readonly=true
            }
            
          });
          var d = $.tokenInputConverter.forparty2node(result.data, {
            selected: scope.selected || [-1]
          })
          $this.jstree({
            'core': {
              'data': d,
              'check_callback': function(o, n, p, i, m) {
                // if (m && m.dnd && m.pos !== 'i') {
                //     return false;
                // }
                // if (o === "move_node" || o === "copy_node") {
                //     if (this.get_node(n).parent === this.get_node(p).id) {
                //         return false;
                //     }
                // }
                return true;
              },
              'themes': {
                'name': false,
                'url': false,
                'dir': false,
                'icons': true,
                'variant': false,
                'stripes': false,
                'responsive': true,
                'dots': true
              }
            },
            'contextmenu': {
              select_node: false,
              'items': function(node) {
                if (isedit) {
                  var items = $.jstree.defaults.contextmenu.items();
                  items.create.label = "添加子部门";
                  items.create.action = function(data) {
                    var inst = $.jstree.reference(data.reference),
                      obj = inst.get_node(data.reference);
                    inst.create_node(obj, {
                      type: "default",
                      text: "新建部门"
                    }, "last", function(new_node) {
                      setTimeout(function() {
                        inst.edit(new_node);
                      }, 0);
                    });
                  }
                  items.rename.label = "重命名";
                  items.remove.label = "删除";
                  items.remove.action = function(data) {
                    var inst = $.jstree.reference(data.reference),
                      obj = inst.get_node(data.reference);
                    config.msg.msgbox.confirm("<p>确定删除 {0} ?</p><p>没有子部门且没有成员的部门才可以被删除。</p>".format(obj.text), function(r) {
                      if (r) {
                        method.postd(path.format("delete"), function(d) {
                          if (config.issucceed(d)) {
                            if (inst.is_selected(obj)) {
                              inst.delete_node(inst.get_selected());
                            } else {
                              inst.delete_node(obj);
                            }
                          } else {
                            config.msg.error(d.message || config.lang.removeError, d.url)
                          }
                        }, {
                          'id': obj.id
                        })

                      };
                    })

                  }
                  delete items.ccp;
                  return items;
                };

              }
            },
            'types': {
              'default': {
                'icon': 'icon icon_folder_blue'
              }
            },
            'plugins': ['types', 'contextmenu', 'wholerow']
          }).on('delete_node.jstree', function(e, data) {

          }).on('create_node.jstree', function(e, data) {
            method.postd(path.format("create"), function(d) {
              data.instance.set_id(data.node, d.id);
            }, {
              'type': data.node.type,
              'pid': data.node.parent,
              'text': data.node.text,
              "visitor":data.node.visitor,
              "type":data.node.type,
              "relaid":data.node.relaid
            })
          }).on('rename_node.jstree', function(e, data) {
            method.postd(path.format("rename"), function(d) {
              data.instance.set_id(data.node, d.id);
            }, {
              'id': data.node.id,
              'text': data.text,
              "visitor":data.visitor,
              "type":data.node.type,
              "relaid":data.node.relaid
            })
          }).on("select_node.jstree", function(e, data) {
            scope.$apply(function() {
              ngModelCtrl.$setViewValue([{name:data.node.text,id:data.node.id,visitor:data.node.visitor,relaid:data.node.original.relaid,type:data.node.original.type}]);
              scope.costom();
            });
          }).on("ready.jstree", function(e, data) {
            if (scope.selected) {
              if (scope.selected[0]) {
              $(iElement).scrollTop($("#" + scope.selected[0]).position().top + $(iElement).scrollTop())
              };

            };

          });
        })
      }

    }


  }
}])
