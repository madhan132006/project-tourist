import hashlib
import time

class Block:

    def __init__(self,data,previous_hash):

        self.timestamp = time.time()
        self.data = data
        self.previous_hash = previous_hash
        self.hash = self.generate_hash()

    def generate_hash(self):

        block = str(self.timestamp)+str(self.data)+str(self.previous_hash)

        return hashlib.sha256(block.encode()).hexdigest()


class Blockchain:

    def __init__(self):

        self.chain=[self.create_genesis_block()]

    def create_genesis_block(self):

        return Block("Genesis Block","0")

    def add_block(self,data):

        prev=self.chain[-1]

        block=Block(data,prev.hash)

        self.chain.append(block)


tourist_chain = Blockchain()