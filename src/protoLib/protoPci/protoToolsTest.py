import unittest #TestCase
from metaTest import _MetaTest
import protoTools

class protoToolsTest(unittest.TestCase):

    def setUp(self):
        self.meta = _MetaTest

    def tearDown(self):
        pass

    def test_Meta2Tree(self):
        for entries in self.meta:
            result = Meta2Tree(entries["oData"], entries["pName"],entries["ptType"])
            self.assertEqual(result, entries["Meta"])
            
    def test_Tree2Meta(self):
        for entries in self.meta:
            result = Tree2Meta(entries["Meta"])
            self.assertEqual(result, entries["Tree"])

            
if __name__ == '__main__':
    unittest.main()
