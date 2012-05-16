
function SortObject(oData) {
    var oNewData = {};
    var aSortArray = [];

    // sort keys
    $.each(oData, function(sKey) {
        aSortArray.push(sKey);
    });
    aSortArray.sort(SortLowerCase);

    // create new data object
    $.each(aSortArray, function(i) {
        if (RealTypeOf(oData[(aSortArray[i])]) == "object" ) {
            oData[(aSortArray[i])] = SortObject(oData[(aSortArray[i])]);
        }
        oNewData[(aSortArray[i])] = oData[(aSortArray[i])];
    });

    return oNewData;

    function SortLowerCase(a,b) {
        a = a.toLowerCase();
        b = b.toLowerCase();
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    }
}
