from pydantic import BaseModel


class WebsiteInput(BaseModel):
    url: str

class PolicyTextInput(BaseModel):
    policy_text: str