/* Wrapper for editing all posts */
var forEach = require('async-foreach').forEach;
post_ids.forEach(function(single_id, index) {
    // Set random wait times to multiple variables to appear more organic
    var quickWait_1 = Math.floor(Math.random() * maxWait) + minWait;
    var quickWait_2 = Math.floor(Math.random() * maxWait) + minWait;
    var quickWait_3 = Math.floor(Math.random() * maxWait) + minWait;
    var quickWait_4 = Math.floor(Math.random() * maxWait) + minWait;
    var waitTime = Math.floor(Math.random() * waitMaxTime) + waitMinTime;

    // Set post url and random post message
    var thePost = "https://m.facebook.com/" + user_id + "/posts/" + single_id ;
    var random_post = randomSentence();

    /**************************
    * Go to the facebook post *
    **************************/
    casper.thenOpen(thePost, function _waitAfterStart() {
        //console.log('Waitfor 1');
        casper.wait(quickWait_1, function() {});
        casper.waitForSelector('div[data-sigil="story-popup-causal-init"]', function _waitAfterClick() {
            this.click('div[data-sigil="story-popup-causal-init"] a[data-sigil="touchable"]');
        },function(){
            this.echo('failed to click feed edit menu', 'INFO');
            //this.capture('edit1.png');
        }, function timeout() {}, 20000);
    });

    casper.then(function _waitAfterClick() {
        //console.log('wait for 2');
    });
    /*****************************
    * Click edit button for post *
    *****************************/
    casper.waitForSelector('a[data-sigil="touchable touchable editPostButton dialog-link enabled_action"]', function _waitAfterClick() {
        //this.evaluate(function () { jq = $.noConflict(true) } ); 
        this.click('a[data-sigil="touchable touchable editPostButton dialog-link enabled_action"]');
        //casper.wait(quickWait_3, function() {});
    },function(){
        this.echo('failed to click feed edit link1', 'INFO');
        //this.capture('edit2.png');
    }, function timeout() {}, 20000);

    casper.then(function _waitAfterClick() {
        //console.log('wait for 3');
    });
    /**********************
    * Change post content *
    **********************/
    casper.waitForSelector('form[data-sigil="m-edit-post-form"]', function _waitAfterClick() {
        this.evaluate(function () { jq = $.noConflict(true) } ); 
        console.log('Trying to edit and submit form : ' + random_post + ' FBID : ' + single_id + ' random wait time : ' + quickWait_1);
        if (this.exists('textarea[data-sigil="m-edit-post-text-area m-textarea-input"]')) {
            this.mouse.move('textarea[data-sigil="m-edit-post-text-area m-textarea-input"]');
            this.mouse.click('textarea[data-sigil="m-edit-post-text-area m-textarea-input"]');
            this.evaluate(function(random_post) {
                $('textarea[data-sigil="m-edit-post-text-area m-textarea-input"]').text(random_post);
            }, random_post);
            casper.sendKeys('textarea[data-sigil="m-edit-post-text-area m-textarea-input"]', random_post, { reset: true } );
            //casper.wait(quickWait_4, function() {});
        } else {
            casper.echo('Cant find text box, skipping this post');
            return;
        }
    },function(){
        this.echo('failed to click feed edit link2', 'INFO');
    }, function timeout() {}, 20000);

    //casper.then(function _waitAfterClick() {
    //    console.log("Edit box filled in..");
    //});

    /****************************
    * Save changed post content *
    *****************************/
    casper.then(function _waitAfterClick() {
        this.mouse.move('button[data-sigil="post-edit-save-button"]');
        this.mouse.down('button[data-sigil="post-edit-save-button"]');
        this.mouse.up('button[data-sigil="post-edit-save-button"]');
        this.mouse.click('button[data-sigil="post-edit-save-button"]');
        var js = this.evaluate(function() {
            return document;
        });
        //fs.write('results.html', this.getPageContent()); 
    })

    casper.then(function _waitAfterClick() {
        //console.log('wait for 4');
    });

    /*****************************
    * Make sure content is saved *
    *****************************/
    casper.waitForSelector('div[data-ad-preview="message"]', function() {
        var edit_check = casper.fetchText('div[data-ad-preview="message"] > p');
        console.log('edit check : ' + edit_check);
        if (edit_check.trim() != random_post.trim()) {
            casper.echo('Edited text does not match after refresh.. exiting');
            casper.echo('Edit check text : ' + edit_check);
            casper.echo('Entered text : ' + random_post);
            this.exit();
        } else {
            console.log("Edit box saved and verified..");
        }
    }, function timeout() { 
        console.log('final wait timeout reached, exiting..');
        this.exit(); 
    }, 20000);
});
