# Don't modify the following code
def evaluate(q_no, u_id, method):
	import urllib2
	import urllib
	import json
	dir(urllib2)
	response = urllib2.urlopen('http://testprep2016.msitprogram.net/msit_exam?q_no='+q_no)
	tests = eval(response.read())
	count = 0
	for test in tests:
		if test[-1] == method(test[0:-1]):
			count = count + 1
	
	testcases_passed = str(count) + " out of "+ str(len(tests))+ " Passed"
	values = {'q_id': q_no, 'u_id': u_id, 'testcases_passed': testcases_passed}
	url = 'http://testprep2016.msitprogram.net/msit_exam'
	data = urllib.urlencode(values)
	req = urllib2.Request(url, data)
	response = urllib2.urlopen(req)
	the_page = response.read()
	print count, "out of", len(tests), "Passed"
