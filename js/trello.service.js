'use strict';

angular.module('TrailApp').factory('TrelloSrv', ['$q', function($q) {
  return {
    authorize: function() {
      return $q(function(resolve, reject) {
        var opts = {
          type: "redirect",
          name: "Andela Trail",
          persist: true,
          expiration: "never",
          success: resolve,
          error: reject
        };
        Trello.authorize(opts);
        
      });
    },
    load: function() {
      return $q(function(resolve, reject) {
        var opts = {
          cards: 'visible',
          card_checklists: 'all',
          card_fields: 'all',
          checklist_fields: 'all',
          fields: 'all',
          labels: 'all',
          member_fields: 'all',
          memberships: 'all',
          memberships_member: true,
          memberships_member_fields: 'all'
        };
        Trello.boards.get('I7Xkqbkn', opts, resolve, reject);
      });
    },
    processCards: function(data) {
      var cards = [];
      return $q(function(resolve) {
        data.cards.forEach(function(card) {
          var _card = {};
          _card.id = card.id;
          _card.name = card.name;
          _card.desc = card.desc;
          _card.labels = [];
          card.labels.forEach(function(label) {
            _card.labels.push(label.name);
          });
          _card.shortUrl = card.shortUrl;
          _card.membersid = card.idMembers;
          _card.tasks = [];
          _card.keyResults = [];
          _card.success = 'SUCCESS';
          card.checklists.forEach(function(checklist) {
            if (checklist.name === 'Tasks') {
              checklist.checkItems.forEach(function(item) {
                if (item.state === 'incomplete') {
                  _card.success = 'INCOMPLETE';
                }
                _card.tasks.push({name: item.name, status: item.state});
              });
            } else {
              checklist.checkItems.forEach(function(item) {
                if (item.state === 'incomplete') {
                  _card.success = 'INCOMPLETE';
                }
                _card.keyResults.push({name: item.name, status: item.state});
              });
            }
          });
          cards.push(_card);
        });
        resolve(cards);
      });
    },
    processMembers: function (data) {
      var members = [];
      return $q(function(resolve) {
        data.memberships.forEach(function(membership) {
          var _member = {};
          _member.id = membership.idMember;
          _member.name = membership.member.fullName;
          members.push(_member);
        });
        resolve(members);
      });
    },
    processLabels: function(data) {
      var labels = [];
      return($q(function(resolve) {
        data.labels.forEach(function(label) {
          labels.push(label.name);
        });
        resolve(labels);
      }));
    }
  };
}]);