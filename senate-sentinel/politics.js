function readyFn(jQuery) {
  console.log("ready, set, and politic")




  // Changes XML to JSON
  function xmlToJson(xml) {
    // Create the return object for XML to JSON
    var obj = {};

    if (xml.nodeType == 1) { // element
      // do attributes
      if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j);
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType == 3) { // text
      obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
      for (var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof(obj[nodeName]) == "undefined") {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof(obj[nodeName].push) == "undefined") {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));
        }
      }
    }
    return obj;
  };


  // data for senators
  var dataForSenators;
  var senatorNum;
  var votesWithPartyAve;
  var crp_id;

  $.ajax({
    url: 'https://api.propublica.org/congress/v1/115/senate/members.json',
    type: 'GET',
    dataType: 'json',
    contentType: "application/json",
    beforeSend: function(xhr) {
      xhr.setRequestHeader("X-API-Key", "PGD2TE9Pyr29q8c2Y4Qx19eQaI0Y4gC87xRIlKcp")
    },
    success: function(dataForSenators) {


console.log(dataForSenators);



      votesWithPartySum = 0;


      dwNominateAll = 0;
      dwNominateCounterAll = 0;
      dwNominateDem = 0;
      dwNominateDemCounter = 0;
      dwNominateRepub = 0;
      dwNominateRepubCounter = 0;

      missedVotesAll = 0;
      missedVotesCounterALL = 0;
      missedVotesDem = 0;
      missedVotesCounterDem = 0;
      missedVotesRepub = 0;
      missedVotesCounterRepub = 0;

      for (var i = 0; i < dataForSenators['results'][0]['members'].length; i++) {

        votesWithPartySum += dataForSenators['results'][0]['members'][i]['votes_with_party_pct'];

        if (dataForSenators['results'][0]['members'][i]['dw_nominate'] !== null) {
          dwNominateAll += dataForSenators['results'][0]['members'][i]['dw_nominate'];
          dwNominateCounterAll++;
        }



        if (dataForSenators['results'][0]['members'][i]['missed_votes_pct'] !== null) {
          missedVotesAll += dataForSenators['results'][0]['members'][i]['missed_votes_pct'];
          missedVotesCounterALL++;
        }


        // for all valid dem senators DW-NOMINATE  and MISSED VOTES AVE
        if (dataForSenators['results'][0]['members'][i]['dw_nominate'] !== null && dataForSenators['results'][0]['members'][i]['party'] === 'D') {
          dwNominateDem += dataForSenators['results'][0]['members'][i]['dw_nominate'];
          // console.log(dwNominateDem)
          dwNominateDemCounter = dwNominateDemCounter + 1;
          // console.log(dwNominateDemCounter)
        }

        if (dataForSenators['results'][0]['members'][i]['missed_votes_pct'] !== null && dataForSenators['results'][0]['members'][i]['party'] === 'D') {
          missedVotesDem += dataForSenators['results'][0]['members'][i]['missed_votes_pct'];
          missedVotesCounterDem++;
        }


        // for all valid repub senators DW-NOMINATE and MISSED VOTES AVE
        if (dataForSenators['results'][0]['members'][i]['dw_nominate'] !== null && dataForSenators['results'][0]['members'][i]['party'] === 'R') {
          dwNominateRepub += dataForSenators['results'][0]['members'][i]['dw_nominate'];
          dwNominateRepubCounter++;
        }

        if (dataForSenators['results'][0]['members'][i]['missed_votes_pct'] !== null && dataForSenators['results'][0]['members'][i]['party'] === 'R') {
          missedVotesRepub += dataForSenators['results'][0]['members'][i]['missed_votes_pct'];
          missedVotesCounterRepub++;
        }
      }

      dwNominateAveAll = dwNominateAll / dwNominateCounterAll;
      dwNominateAveDem = dwNominateDem / dwNominateDemCounter;
      dwNominateAveRepub = dwNominateRepub / dwNominateRepubCounter;

      missedVotesAveAll = missedVotesAll / missedVotesCounterALL;
      missedVotesAveDem = missedVotesDem / missedVotesCounterDem;
      missedVotesAveRepub = missedVotesRepub / missedVotesCounterRepub;


// PARTYSORTER BOX
      function partySort(){
        for (var i = 0; i < dataForSenators['results'][0]['members'].length; i++){

          if (dataForSenators['results'][0]['members'][i]['party'] === 'R'){
            var thisLastName = dataForSenators['results'][0]['members'][i]['last_name'];
            var partySortRepub = $(`<div class='partySortRepub clickName'><h3>${thisLastName}</h3></div>`);
            $('.republicanBox').append(partySortRepub);
            console.log("thislastname")
            console.log(thisLastName);
          }
          if (dataForSenators['results'][0]['members'][i]['party'] === 'D'){
            var thisLastName = dataForSenators['results'][0]['members'][i]['last_name'];
            var partySortDem = $(`<div class='partySortDem clickName'><h3>${thisLastName}</h3></div>`);
            $('.democratBox').append(partySortDem);
          }
          if (dataForSenators['results'][0]['members'][i]['party'] === 'I'){
            var thisLastName = dataForSenators['results'][0]['members'][i]['last_name'];
            var partySortInd = $(`<div class='partySortInd'><h3 class='clickName'>${thisLastName}</h3></div>`);
            $('.independentBox').append(partySortInd);
          }
        }
      }
partySort();

$('.clickName').click(function(e){
  searchValue = $(this).text();
  $('.pic').empty();
  $('.candidatename').empty();
  $('.party').empty();
  $('.state').empty();
  $('.nextElection').empty();
  $('.senority').empty();
  $('.missed_votes_pct').empty();
  $('.dwNominate').empty();
  $('.voteWParty').empty();
  $('.voteWPartyAve').empty();
  $('.topTenTitle').empty();
  $('.companyNames').empty();
  $('.companyDonations').empty();
  $('.email').empty();
  $('.fb').empty();
  $('.barChartTitle').empty();
  $('.topTenTitle').empty();
  $('.companyNames').empty();
  $('.companyDonationsRank').empty();
  $('.companyDonations').empty();
  $('.chartTitle').empty();
  $('.twitter').empty();
  $('.companyDonationsRank').empty();
  $('.stats').empty();
  $('.chart').empty();
  $('.chart').append(`<canvas id="doughnut-chart" width="450" height="450"></canvas>`)
  getSenatorNum(searchValue);

})




      var crp_id;
      let searchValue

      function getSenatorNum(searchValue) {
        for (var i = 0; i < dataForSenators['results'][0]['members'].length; i++) {

          if (searchValue == dataForSenators['results'][0]['members'][i]['last_name']) {
            senatorNum = i;
            // console.log(z);
            crp_id = dataForSenators['results'][0]['members'][i]['crp_id']
          }
        }
        votesWithPartyAve = votesWithPartySum / 100;



        function populateForm(z) {
          console.log("populateForm function")
          //REFRESH CRP_ID value
          function getCRPID() {
            crp_id = dataForSenators['results'][0]['members'][z]['crp_id'];
            // console.log(crp_id)
            senatorNum = z;
          }
          getCRPID();



          // ----- NAME
          var nameFirst = dataForSenators['results'][0]['members'][z]['first_name'];
          var nameLast = dataForSenators['results'][0]['members'][z]['last_name'];
          var nameElem = document.createElement('h1');
          nameElem.innerText = nameFirst + ' ' + nameLast;
          $('.candidatename').append(nameElem);
          // $("nameElem").center();


          // ----- PIC
          var nameFull = nameFirst.toLowerCase() + '-' + nameLast.toLowerCase();
          var picURL = "./resources/" + nameFull + ".jpg";
          var picElem = new Image(550, 550);
          picElem.src = picURL;
          $('.pic').append(picElem);
          // $("picElem").center()






          // ------ BIO     PARTY / STATE
          var party = '';
          if (dataForSenators['results'][0]['members'][z]['party'] === 'R') {
            party = "Republican"
          }
          if (dataForSenators['results'][0]['members'][z]['party'] === 'I') {
            party = "Independent"
          }
          if (
            dataForSenators['results'][0]['members'][z]['party'] === "D") {
            party = "Democrat"
          }
          var partyElem = document.createElement('h3');
          partyElem.innerText = party;
          $('.party').append(partyElem);
          var state = dataForSenators['results'][0]['members'][z]['state'];
          var stateElem = document.createElement('h3');
          stateElem.innerText = state;
          $('.state').append(stateElem);


          // EMAIL LINK
          var contactLink = dataForSenators['results'][0]['members'][z]['contact_form'];
          var contactLinkElem = `<a href="${contactLink}"><img src="./resources/mail.png" id='twitter' class='socialicon'></a>`;
          $('.email').append(contactLinkElem);


          // TWITTER
          var twitterLink = dataForSenators['results'][0]['members'][z]['twitter_account'];
          var twitterLinkElem = $(`<a href="https://twitter.com/search?q=${twitterLink}"><img src="./resources/twitter.png" id='twitter' class='socialicon'></a>`)
          $('.twitter').append(twitterLinkElem);


          // FACEBOOK
          var facebookLink = dataForSenators['results'][0]['members'][z]['facebook_account'];
          var facebookLinkElem = $(`<a href="http://www.facebook.com/${facebookLink}"><img src="./resources/facebook.png" id="facebook" class='socialicon'></a>`)
          $('.fb').append(facebookLinkElem);


          // NEXT ELECTION
          var nextElection = dataForSenators['results'][0]['members'][z]['next_election'];
          var nextElectionElem = $(`<h3>Next election: ${nextElection}</h3>`);
          $('.nextElection').append(nextElectionElem);


          // SENORITY
          var senority = dataForSenators['results'][0]['members'][z]['seniority'];
          var senorityElem = $(`<h3>Senority: No. ${senority}</h3>`);
          $('.senority').append(senorityElem);

          //DW NOMINATE / SCORE
          var dwNominate = dataForSenators['results'][0]['members'][z]['dw_nominate'];
          var dwNominateElem = $(`<h3>DW Nominate Value: ${dwNominate}</h3>`);
          $('.dwNominate').append(dwNominateElem);

          if (party === "Democrat") {
            var dwNominateAve = $(`<h3>Democrat DW Average: ${dwNominateAveDem}</h3>`);
            $('.dwNominate1').append(dwNominateAve);
          } else if (party === "Republican") {
            var dwNominateAve = $(`<h3>Republican DW Average: ${dwNominateAveRepub}</h3>`);
            $('.dwNominate1').append(dwNominateAve);
          }


          // MISSED VOTES
          var missed_votes_pct = dataForSenators['results'][0]['members'][z]['missed_votes_pct'];
          var missed_votes_pctElem = $(`<h3>Missed votes ${missed_votes_pct}%</h3>`);
          $('.missed_votes_pct').append(missed_votes_pctElem);

          // VOTE WITH PARTY
          var voteWParty = dataForSenators['results'][0]['members'][z]['votes_with_party_pct'];
          var voteWPartyElem = $(`<h3>Votes ${party}: ${voteWParty}%</h3>`);
          $('.voteWParty').append(voteWPartyElem);
          var votesWithPartyAveElem = $(`<h3>Average vote with party %: ${votesWithPartyAve}%</h3>`)
          $('.votesWithPartyAve').append(votesWithPartyAveElem);

          // BACKGROUND COLOR BY PARTY
          if (dataForSenators['results'][0]['members'][z]['party'] === 'R') {
            backGroundColor = "rgba(166, 31, 35, .6)"
          }
          if (dataForSenators['results'][0]['members'][z]['party'] === 'I') {
            backGroundColor = "grey"
          }
          if (
            dataForSenators['results'][0]['members'][z]['party'] === "D") {
            backGroundColor = "rgba(63, 110, 182, .6)"
          }
          $(".partisanbox").css('background-color', backGroundColor);


          // BARCHART TITLE
          var barchartTitle = $(`<h1>Senator ${nameFirst} ${nameLast}  in Comparison</h1>`);
          $('.barChartTitle').append(barchartTitle);


          var dataCandidate = [(missed_votes_pct), (missed_votes_pct), (dwNominate), (voteWParty / 100)]
          var dataAverage;


          if (party === 'Democrat') {
            dataAverage = [(missedVotesAveAll), (missedVotesAveDem), (dwNominateAveDem), (votesWithPartyAve / 100)]
          } else if (party === "Republican") {
            dataAverage = [(missedVotesAveAll), (missedVotesAveRepub), (dwNominateAveRepub), (votesWithPartyAve / 100)]
          }

          console.log("missedVotesAveAll" + missedVotesAveAll)
          console.log("results for chart arrays are:" + dataCandidate + dataAverage)
          var canvas = document.getElementById('barChart');
          var data = {
            labels: ["Missed Votes(all)", "Missed Votes(party)", "DW Nominate(party)", "Votes Party Line(all)"],
            datasets: [{
              label: "Senator Values",
              backgroundColor: "#a77926",
              borderColor: "#f3b137",
              borderWidth: 5,
              hoverBackgroundColor: "#000066",
              hoverBorderColor: "#000066",
              data: dataCandidate,
            }, {
              label: "Population Values",
              backgroundColor: "#37b7f3",
              borderColor: "#306b7a",
              borderWidth: 3,
              hoverBackgroundColor: "#000066",
              hoverBorderColor: "#000066",
              data: dataAverage,
            }]
          };

          var myBarChart = Chart.Bar(canvas, {

            data: data,
            options: {
              legend: {
                labels: {
                  fontColor: '#4B4B4C',
                  fontSize: 25,
                  fontFamily: "Helvetica"
                }
              },

              scales: {
                xAxes: [{
                  ticks: {
                    beginAtZero: true,
                    fontSize: 22,
                    fontColor: '#4B4B4C',
                    fontFamily: "Helvetica"

                  }
                }],
                yAxes: [{
                  ticks: {
                    fontSize: 25,
                    fontColor: "#4B4B4C",
                    fontFamily: "Helvetica"
                  }
                }]
              }
            }
          });


          // ------- GETTING INTO THE OPEN SECRETS API candContrib--------//

          $.get('http://www.opensecrets.org/api/?method=candContrib&cid=' + crp_id + '&cycle=2016&apikey=4fb8a3a3b8b47c12a198701bfb3b1cfb&', function(dataOSCandContrib) {
            dataOSCandContrib = xmlToJson(dataOSCandContrib)
            console.log('candcontrib get here')
            // console.log(dataOSCandContrib);

            // HEADING FOR THE TOP TEN
            var topTenHeadingElem = $(`<h1>Top Ten Campaign Contributors</h1>`)
            $('.topTenTitle').append(topTenHeadingElem);


            // GENERATE 10 TOP DONORS & totalFromTen
            var totalFromTen = 0;
            for (var j = 0; j < 10; j++) {
              var eachSource = dataOSCandContrib['response']['contributors']['contributor'][j]['@attributes']['org_name'] + ":"

              var eachAmount = dataOSCandContrib['response']['contributors']['contributor'][j]['@attributes']['total'];

              totalFromTen += parseInt(dataOSCandContrib['response']['contributors']['contributor'][j]['@attributes']['total']);

              var eachSourceElem = $(`<h4>${j + 1}. ${eachSource}</h4>`)
              $('.companyNames').append(eachSourceElem);

              var eachRankElem = $(`<h4>-</h4>`)
              $('.companyDonationsRank').append(eachRankElem);

              var eachAmountElem = $(`<h4>$${eachAmount}</h4>`)
              $('.companyDonations').append(eachAmountElem);

            }
            // TOTAL FROM TEN totalFromTen var
            var totalFromTenElem = $(`<h2>Total: $${totalFromTen}</h2>`)
            $('.companyDonations').append(totalFromTenElem);


            // DISCLAIMER FOR CHART INFO
            var cycle = dataOSCandContrib['response']['contributors']['@attributes']['cycle']
            var cycleElem = $(`<h3>* ${cycle}</h3>`)
            $('.stats').append(cycleElem);
            var origin = dataOSCandContrib['response']['contributors']['@attributes']['origin']
            var originElem = $(`<h5>* ${origin}</h5>`)
            $('.stats').append(originElem);


          })






          // GETTING INTO OPEN SECRETS API BY SECTOR:
          $.get('http://www.opensecrets.org/api/?method=candSector&cid=' + crp_id + '&cycle=2016&apikey=4fb8a3a3b8b47c12a198701bfb3b1cfb&', function(dataOSSector) {

            dataOSSector = xmlToJson(dataOSSector)
            console.log('transmit dataOSSector next');
            console.log(dataOSSector);
            console.log('transmit dataOSSector finished');

            // DATA DECLARED FOR THE CHART TO GENERATE


            var chartData = {
              type: 'doughnut',
              data: {
                labels: [],
                datasets: [{
                  label: "Donation Dollars",
                  backgroundColor: ["#4fafc6", "#f3b137", "#409d46", "#4f87c6", "#a77926", "#5fea68", "#30537a", "#a77926", "#306b7a", "#37b7f3", "#9d4097", "#c6674f", "#3cba9f", "#e8c3b9", "#c45850", "#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
                  data: []
                }]
              },
              options: {
                legend: {
                  labels: {
                    fontColor: '#4B4B4C',
                    fontSize: 25
                  }
                },
                // title: {
                //     display: true,
                //     text: 'Breakdown of Donations by Sector',
                //     fontSize: 30,
                //     fontColor: 'black'
                // },
                circumference: Math.PI,
                cutoutPercentage: 30,
                rotation: -Math.PI,
                // animation: {
                //   animateRotate: false,
                //   animateScale: true
                // }
              }
            }

            // PIE CHART TITLE
            var chartTitle = $(`<h1>Senator ${nameLast}'s Donations by Sector</h1>`);
            $('.chartTitle').append(chartTitle);



            // FUNCTION TO PUSH DATA INTO CHARTDATA VARIABLE
            function chartPusher() {

              chartData['data']['datasets'][0]['data'].length = 0;
              chartData['data']['labels'].length = 0;

              for (var i = 0; i < dataOSSector['response']['sectors']['sector'].length; i++) {

                chartData['data']['labels'].push(dataOSSector['response']['sectors']['sector'][i]['@attributes']['sector_name']);
                // console.log(doughnut);

                chartData['data']['datasets'][0]['data'].push(parseInt(dataOSSector['response']['sectors']['sector'][i]['@attributes']['total']));
                // console.log(doughnut);
              }

              // CALLS THE CHART TO BE GENERATED FROM PREVIOUS DATA
              console.log("target: ", document.getElementById("doughnut-chart"));
              console.log(chartData);
              var doughnut = new Chart(document.getElementById("doughnut-chart"), chartData);
            }

            chartPusher();
          })

        }
        populateForm(senatorNum)

        $('#prevPoli').click(function(e) {
          $('.barChartTitle').empty();
          $('.topTenTitle').empty();
          $('.companyNames').empty();
          $('.companyDonationsRank').empty();
          $('.companyDonations').empty();
          $('.chartTitle').empty();
          $('.pic').empty();
          $('.candidatename').empty();
          $('.party').empty();
          $('.state').empty();
          $('.nextElection').empty();
          $('.senority').empty();
          $('.missed_votes_pct').empty();
          $('.dwNominate').empty();
          $('.voteWParty').empty();
          $('.voteWPartyAve').empty();
          $('.topTenTitle').empty();
          $('.companyNames').empty();
          $('.companyDonations').empty();
          $('.email').empty();
          $('.fb').empty();
          $('.twitter').empty();
          $('.companyDonationsRank').empty();
          $('.stats').empty();
          $('.chart').empty();
          $('.chart').append(`<canvas id="doughnut-chart" width="450" height="450"></canvas>`);
          senatorNum--;
          populateForm(senatorNum - 1);

          // console.log("clickworks on prev senator");
        })


        $('#nextPoli').click(function(e) {
          $('.barChartTitle').empty();
          $('.topTenTitle').empty();
          $('.companyNames').empty();
          $('.companyDonationsRank').empty();
          $('.companyDonations').empty();
          $('.chartTitle').empty();
          $('.pic').empty();
          $('.candidatename').empty();
          $('.party').empty();
          $('.state').empty();
          $('.nextElection').empty();
          $('.senority').empty();
          $('.missed_votes_pct').empty();
          $('.dwNominate').empty();
          $('.voteWParty').empty();
          $('.voteWPartyAve').empty();
          $('.topTenTitle').empty();
          $('.companyNames').empty();
          $('.companyDonations').empty();
          $('.email').empty();
          $('.fb').empty();
          $('.twitter').empty();
          $('.companyDonationsRank').empty();
          $('.stats').empty();
          $('.chart').empty();
          $('.chart').append(`<canvas id="doughnut-chart" width="450" height="450"></canvas>`)
          populateForm(senatorNum + 1);
          senatorNum++;

          console.log("clickworks on next senator")
        })

      }




      // get senators name / num variable set up

      $('#findPoli').click(function(event) {
        $('.pic').empty();
        $('.candidatename').empty();
        $('.party').empty();
        $('.state').empty();
        $('.nextElection').empty();
        $('.senority').empty();
        $('.missed_votes_pct').empty();
        $('.dwNominate').empty();
        $('.voteWParty').empty();
        $('.voteWPartyAve').empty();
        $('.topTenTitle').empty();
        $('.companyNames').empty();
        $('.companyDonations').empty();
        $('.email').empty();
        $('.fb').empty();
        $('.twitter').empty();
        $('.companyDonationsRank').empty();
        $('.stats').empty();
        $('.chart').empty();
        $('.chart').append(`<canvas id="doughnut-chart" width="450" height="450"></canvas>`)
        searchValue = $("#search").val();
        getSenatorNum(searchValue);

      })

      // console.log(dataForSenators['results'][0]['members'][i]['last_name'])

    }


  });






}
// this is the end of the ready function we always run with jQuery.
$(window).on("load", readyFn);
