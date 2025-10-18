
import getpass
import os

from database import SessionLocal
# from app.models.teacherModels import create_assignment
from app.models.studentModels import get_grades_student_id

from langchain.chat_models import init_chat_model

llm = init_chat_model("google_genai:gemini-2.0-flash")

from langchain_core.runnables import RunnableConfig
from langgraph.graph import  MessagesState, START , END , StateGraph
from langgraph.checkpoint.postgres import PostgresSaver
from langgraph.store.base import BaseStore
import uuid
from langgraph.checkpoint.postgres import PostgresSaver

  

from typing import Annotated
from langchain_core.messages import ToolMessage
from langchain_core.tools import InjectedToolCallId, tool
from typing_extensions import TypedDict
from langgraph.store.postgres import PostgresStore
from langgraph.checkpoint.memory import InMemorySaver
# from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.types import Command, interrupt

class State(TypedDict):
    messages: Annotated[list, add_messages]
    user_id:str



@tool
def human_assistance(
    name: str, birthday: str, tool_call_id: Annotated[str, InjectedToolCallId]
) -> str:
    """Request assistance from a human."""
    human_response = interrupt(
        {
            "question": "Is this correct?",
            "name": name,
            "birthday": birthday,
        },
    )
    if human_response.get("correct", "").lower().startswith("y"):
        verified_name = name
        verified_birthday = birthday
        response = "Correct"
    else:
        verified_name = human_response.get("name", name)
        verified_birthday = human_response.get("birthday", birthday)
        response = f"Made a correction: {human_response}"

    state_update = {
        "name": verified_name,
        "birthday": verified_birthday,
        "messages": [ToolMessage(response, tool_call_id=tool_call_id)],
    }
    return Command(update=state_update)

@tool
def get_grades_student_id_tool(user_id:str):
    """returns student grades of all class and assignment"""
    # user_id = config["configurable"]["user_id"] 
    # print(user_id)
    # print("user_id")

    # result = get_grades_student_id(user_id)
    return 100





tools = [ human_assistance,get_grades_student_id_tool]
llm_with_tools = llm.bind_tools(tools)

def chatbot(
        state: State,
        config: RunnableConfig,
        *,
        store: BaseStore,
    ):
        user_id = config["configurable"]["user_id"]
        namespace = ("memories", user_id)
        memories = store.search(namespace, query=str(state["messages"][-1].content))
        info = "\n".join([d.value["data"] for d in memories])
        system_msg = f"You are a helpful assistant talking to the user. User info: {info}"

        # Store new memories if the user asks the model to remember
        last_message = state["messages"][-1]
        if "remember" in last_message.content.lower():
            memory = "User name is partha"
            store.put(namespace, str(uuid.uuid4()), {"data": memory})

        response = llm_with_tools.invoke(
            [{"role": "system", "content": system_msg}] + state["messages"]
        )
        return {"messages": [response]}



DB_URI = "postgresql://postgres.uomfykaurszamahxdwhy:Edding.5000208@aws-0-us-east-2.pooler.supabase.com:5432/postgres"

async def StudentChatBot(user_id:str,query:str)->str:
 with (
    PostgresStore.from_conn_string(DB_URI) as store,
    PostgresSaver.from_conn_string(DB_URI) as checkpointer,
   ):
    graph_builder = StateGraph(State)
    graph_builder.add_node("chatbot", chatbot)

    tool_node = ToolNode(tools=tools)
    graph_builder.add_node("tools", tool_node)

    graph_builder.add_conditional_edges(
        "chatbot",
        tools_condition,
    )
    graph_builder.add_edge("tools", "chatbot")
    graph_builder.add_edge(START, "chatbot")

    graph = graph_builder.compile(checkpointer=checkpointer,store=store)
    config = {
        "configurable": {
            "thread_id": user_id,
            "user_id": user_id,
        }
    }

    

    for chunk in graph.stream(
        {
            "messages": [{"role": "user", "content": query}],
            "user_id": str(user_id),
            },
        config,
        stream_mode="values",
        store=store
    ):
        temp = chunk["messages"][-1]
    return temp
 

  
