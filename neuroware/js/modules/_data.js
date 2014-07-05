/*
 * 
 *  Neuroware v0.1.1
 *  http://neuroware.io
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 */

(function($) 
{
    // EMPTY OBJECTS
    var data = {};
    var stores = {};
    var dbs = {};
    var db_request = null;
    var version = 1;
    var neuroware_data = {};
    var indexed = false;
    var current_db_version = 1;
    if(localStorage)
    {
        $.fn.neuroware.settings.info.storage = {
            local: {
                used: '' + ((JSON.stringify(localStorage).length * 2) / 1000000) + ' MB',
                remaining: '' + ((2490000 - (JSON.stringify(localStorage).length * 2)) / 1000000) + ' MB'
            }
        };
    }
    if(typeof window.indexedDB === 'object') indexed = true;
    
    // FUNCTIONS FOR OBJECT
    data.get = function(key)
    {
        if(!key) key = 'index';
        return $.fn.neuroware.data[key];
    };
    data.put = function(key, value)
    {
        $.fn.neuroware.data[key] = value;
    };
    data.item = function(db_name, collection, key)
    {
        return db_name + '_' + collection + '_' + key;
    };
    data.open = function(collection, callback, db_name, version)
    {
        console.log('opening ', collection);
        if(!version) version = current_db_version + 1;
        if(!db_name) db_name = 'neuroware_' + $.fn.neuroware.settings.id;
        if(!dbs[collection])
        {
            delete(dbs);
            dbs = {};
            dbs[collection] = window.indexedDB.open(db_name, version);
        }
        
        console.log('dbs: '+collection, dbs);
        dbs[collection].onerror = function(event) 
        {
            // Handle errors.
        };
        dbs[collection].onupgradeneeded = function(event) 
        {
            console.log('onupgradeneeded', collection);
            var db = event.target.result;                
            current_db_version = db.version;
            stores[collection] = db.createObjectStore(collection, {keyPath:'k'});
            var slug_index = stores[collection].createIndex('k', 'k', {unique:true});

            if(indexed)
            {
                data.size(function(size)
                {
                    callback(stores[collection]);
                }, stores[collection])
            }
            else
            {
                callback(stores[collection]);
            }
        };
        dbs[collection].onsuccess = function(event)
        {
            console.log('onsuccess', collection);
            
            var db = event.target.result;
            current_db_version = db.version;
            var transaction = db.transaction(collection, 'readwrite');
            stores[collection] = transaction.objectStore(collection);
           
            callback(stores[collection]);
        }
    };
    data.find = function(collection, key, callback, store, db_name)
    {
        if(!db_name) db_name = 'neuroware_' + $.fn.neuroware.settings.id;
        if(!indexed && localStorage && localStorage.getItem(data.item(db_name, collection, key)))
        {
            localStorage.getItem(data.item(db_name, collection, key));
            callback();
        }
        else if(indexed)
        {
            if(store) var request = store.get(key)
            else 
            {
                if(stores[collection])
                {
                    var request = stores[collection].get(key);
                    request.onsuccess = function() {
                        callback(request.result);
                    };
                }
                else
                {
                    callback();
                }
            }
        }
        else
        {
            callback(false);
        }
    };
    data.save = function(store, collection, key, value, callback, db_name, version)
    {
        if(!db_name) db_name = 'neuroware_' + $.fn.neuroware.settings.id;
        if(!indexed && localStorage)
        {
            if(localStorage)
            {
                localStorage.setItem(data.item(db_name, collection, key), value);
                callback();
            }
        }
        else if(indexed)
        {
            var db_data = {
                k: key,
                v: value
            };
            if(!db_name) db_name = 'neuroware_' + $.fn.neuroware.settings.id;        
            var results = store.put(db_data);
            results.onsuccess = function(results)
            {
                callback(results);
            }
        }
        else
        {
            callback(false);
        }
    };
    data.size = function(callback, store, db_name)
    {
        if(!db_name) db_name = 'neuroware_' + $.fn.neuroware.settings.id;    
        if(stores[db_name] !== null)
        {
            var size = 0;
            var transaction = store.openCursor();
            transaction.onsuccess = function(event)
            {
                var cursor = event.target.result;
                if(cursor)
                {
                    var storedObject = cursor.value;
                    var json = JSON.stringify(storedObject);
                    size += json.length;
                    cursor.continue();
                }
                else
                {
                    $.fn.neuroware.settings.info.storage.indexed = {
                        used: '' + ((size * 2) / 1000000) + ' MB',
                        remaining: '' + ((5000000 - size) / 1000000) + ' MB'
                    };
                    callback(size, null);
                }
            }.bind(this);
            transaction.onerror = function(err)
            {
                callback(null, err);
            }
        }
        else
        {
            callback(null, null);
        }
    };    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.neuroware, {data:data});
})
(jQuery);
